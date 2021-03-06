const Client = require('../model/Client')
const Barber = require('../model/Barber')
const Service = require('../model/Service')
const Turn = require('../model/Turn')
const { validationResult } = require('express-validator')
const Person = require('../model/Person')

exports.createTurn = async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { date, idService, idBarber, idClient } = req.body

        if (date <= new Date().getTime()) {
            return res.status(400).send(`The date must be today or a future date`)
        }

        const service = await Service.findByPk(idService)
        if (!service) {
            return res.status(400).send(`Service not found`)
        }

        const barber = await Barber.findByPk(idBarber)
        if (!barber) {
            return res.status(400).send(`Barber not found`)
        }

        const client = await Client.findByPk(idClient)
        if (!client) {
            return res.status(400).send(`Client not found`)
        }

        const existTurnInTheSameDate = await Turn.findOne({ where: {date:date} })
        if (existTurnInTheSameDate) {
            return res.status(400).send(`There is a turn in the same date`)
        }

        await Turn.create({
            date: date,
            service_id: idService,
            barber_id: idBarber,
            client_id: idClient
        })

        res.status(200).send(`Turn created`)

    } catch (error) {
        console.log(error)
        res.status(500).send('There was a server error')
    }
}

exports.getTurns = async(req, res) => {
    try {
        const turns = await Turn.findAll({
            include: [
                { model: Barber },
                { model: Client },
                { model: Service }
            ],
            attributes: {
                exclude: [
                    'client_id',
                    'barber_id',
                    'service_id'
                ]
            }
        })
        res.json({turns})
    } catch (error) {
        console.log(error)
        res.status(500).send('There was a server error')
    }
}

exports.getTurn = async(req, res) => {
    try {
        const id = req.params.id

        const turn = await Turn.findByPk(id, {
            include: [
                { model: Barber },
                { model: Client },
                { model: Service }
            ],
            attributes: {
                exclude: [
                    'client_id',
                    'barber_id',
                    'service_id'
                ]
            }
        })
        if (!turn) {
            return res.status(400).send(`Turn not found`)
        }

        res.json({turn})
    } catch (error) {
        console.log(error)
        res.status(500).send('There was a server error')
    }
}

exports.updateTurn = async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        const id = req.params.id

        const turnToUpdate = await Turn.findByPk(id)
        if (!turnToUpdate) {
            return res.status(400).send(`Turn not found`)
        }

        const { date, idService, idBarber, idClient } = req.body

        if (date <= new Date().getTime()) {
            return res.status(400).send(`The date must be today or a future date`)
        }

        const service = await Service.findByPk(idService)
        if (!service) {
            return res.status(400).send(`Service not found`)
        }

        const barber = await Barber.findByPk(idBarber)
        if (!barber) {
            return res.status(400).send(`Barber not found`)
        }

        const client = await Client.findByPk(idClient)
        if (!client) {
            return res.status(400).send(`Client not found`)
        }

        const existTurnInTheSameDate = await Turn.findOne({ where: {date:date} })
        if (existTurnInTheSameDate && existTurnInTheSameDate.id !== turnToUpdate.id) {
            return res.status(400).send(`There is a turn in the same date`)
        }

        turnToUpdate.set({
            date: date,
            service_id: idService,
            barber_id: idBarber,
            client_id: idClient
        })
        await turnToUpdate.save()

        res.status(200).send(`Turn updated`)
    } catch (error) {
        console.log(error)
        res.status(500).send('There was a server error')
    }
}

exports.deleteTurn = async(req, res) => {
    try {

    } catch (error) {
        console.log(error)
        res.status(500).send('There was a server error')
    }
}