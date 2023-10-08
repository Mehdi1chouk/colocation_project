/*const mongoose = require('mongoose');
const houseType = 'House';



const houseSchema = new mongoose.Schema({
    selectedradio: {
        type: String,
        required: true,
        enum: ['villa', 'maison', 'appartement', 'maison d\'hote', 'chambre partagé'],
    },
    etat: {
        type: String,
        required: false,
    },
    date1: {
        type: Date,
        required: false,
    },
    date2: {
        type: Date,
        required: false,
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
        type: Object,
        required: false,
    },
}, { discriminatorKey: 'selectedradio' });

// Define sub-schemas for each type of house
const Villa = mongoose.model('Villa', new mongoose.Schema({
    houseType: { type: String, required: true, default: 'villa' },

    piscine: {
        type: Boolean,
        required: false,
    },
    jardin: {
        type: Boolean,
        required: false,
    }

}));
const Maison = mongoose.model('Maison', new mongoose.Schema({
    houseType: { type: String, required: true, default: 'maison' },
    garage: {
        type: Boolean,
        required: false,
    },
    jardin: {
        type: Boolean,
        required: false,
    }
}));
const Appartement = mongoose.model('Appartement', new mongoose.Schema({
    houseType: { type: String, required: true, default: 'appartement' },
    etage: {
        type: Number,
        required: false,
    },
    ascenseur: {
        type: Boolean,
        required: false,
    },
}));

const MaisonDhote = mongoose.model('MaisonDhote', new mongoose.Schema({
    houseType: { type: String, required: true, default: 'maison d\'hote' },
    nb_chambres: {
        type: Number,
        required: false,
    },
    nb_lits: {
        type: Number,
        required: false,
    }
}));
const ChambrePartagee = mongoose.model('ChambrePartagee', new mongoose.Schema({
    houseType: { type: String, required: true, default: 'chambre partagé' },
    nb_lits: {
        type: Number,
        required: false,
    },
}));



// Export the generic schema model as default
module.exports = mongoose.model('House', houseSchema);

async function myFunction(req) {
    const houseType = req.body.selectedradio;
    // rest of the code...
}
const House = mongoose.model(houseType);
const house = new House(req.body);
async function saveHouse() {
    // code to create and save a new house object
    await house.save();
}


// Check if the collection for the selected house type exists
async function getCollections() {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections);
}

// Call the asynchronous function
getCollections();
const collectionExists = collections.some((c) => c.name === houseType);
async function createCollectionIfNotExists(houseType) {
    const collectionExists = await mongoose.connection.db
        .listCollections({ name: houseType })
        .hasNext();

    if (!collectionExists) {
        await mongoose.connection.createCollection(houseType);
    }
}

// call the function
createCollectionIfNotExists('houses');


// Validate the house type
if (!['villa', 'maison', 'appartement', 'maison d\'hote', 'chambre partagé'].includes(houseType)) {
    res.status(400).send('Invalid house type');
    return;
}

// Create the house document based on the selected house type

switch (houseType) {
    case 'villa':
        house = new Villa(req.body);
        break;
    case 'maison':
        house = new Maison(req.body);
        break;
    case 'appartement':
        house = new Appartement(req.body);
        break;
    case 'maison d\'hote':
        house = new MaisonDhote(req.body);
        break;
    case 'chambre partagé':
        house = new ChambrePartagee(req.body);
        break;
    default:
        res.status(400).send('Invalid house type');
        return;
}

const createHouse = async(req, res) => {
    try {
        const house = new House(req.body);
        await house.save();
        res.status(201).send(house);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

// Save the house document to the appropriate collection
/*
try {
    await createHouse();
    res.status(201).send('House created successfully');
} catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while creating the house');
}

async function createHouse() {
    // your code here
    await house.save();
}*/

//module.exports = House;