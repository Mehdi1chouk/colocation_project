const mongoose = require('mongoose')



const MaisonSchema = mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    etage: {
        type: String,
        required: false,
    },
    datedepublication: {
        type: Date,
        default: Date.now
    },
    selectedtype: {
        type: String,
        required: false,
    },
    etat: {
        type: String,
        required: false,
    },
    garage: {
        type: String,
        required: false,
    },
    calendrier: {
        type: Object,
        required: false
    },
    region: {
        type: String,
        required: false,
    },
    delegation: {
        type: String,
        required: false,
    },
    localite: {
        type: String,
        required: false,
    },
    cp: {
        type: Number,
        required: false,
    },
    surface: {
        type: Number,
        required: false,
    },
    chambre: {
        type: Number,
        required: false,
    },
    lits: {
        type: Number,
        required: false,
    },
    sdb: {
        type: Number,
        required: false,
    },
    prix: {
        type: Number,
        required: false,
    },
    photos: {
        type: Array,
        required: false,
    },
    titre: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    icons: {
        type: Array,
        required: false,
    },
    localisation: {
        lat: {
            type: Number,
            required: false,
        },
        lng: {
            type: Number,
            required: false,
        }
    }
})

const Maison = mongoose.model('maison', MaisonSchema);

module.exports = Maison;