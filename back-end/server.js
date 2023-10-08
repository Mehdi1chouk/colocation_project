const express = require("express");
const app = express();
const cors = require("cors");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});
app.use(cors());
const path = require("path");
bodyParser = require("body-parser");
const mongoose = require("mongoose");
dbConfig = require("./db/database");
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const multer = require("multer");

const Villa = require("./model/villa");
const Maison = require("./model/maison");
const Appartement = require("./model/appartement");
const MaisonHote = require("./model/maisonhote");
const ChambrePartage = require("./model/chambrepartage");

const ChatMessage = require("./model/chat");
const Reservation = require('./model/reservation');

const User = require("./model/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const session = require("express-session");
app.use(errHandler);

const secretKey = "fjkdgfjkdgdkjgdfkjhjfgjhjfzsqsqxg";

app.use(
    session({
        secret: "fdgjfkgjfdgfdgkjfdhgkjfdgfdjk",
        resave: false,
        saveUninitialized: true,
    })
);

//app.use(express.json());




httpServer.listen(3030, () => {
    console.log('Server listening on port 3030');
});


function createChatRoom(userID1, userID2) {
    // Generate a unique chat room ID based on the user IDs
    const chatRoomID = `${userID1}-${userID2}`;
    // You can add additional logic here to handle unique chat room creation
    return chatRoomID;
}


let ownerSocketId; // Variable to store owner's socket ID

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChat', ({ currentUserID, houseOwnerID }) => {
        const chatRoom = createChatRoom(currentUserID, houseOwnerID);
        socket.join(chatRoom);

        if (currentUserID === houseOwnerID) {
            ownerSocketId = socket.id; // Store owner's socket ID
        } else {
            // Emit userJoined event to the owner
            io.to(ownerSocketId).emit('userJoined', { userID: currentUserID });
        }

        console.log('current', currentUserID);
        console.log('owner', houseOwnerID);
    });

    socket.on('sendMessage', ({ currentUserID, houseOwnerID, message }) => {
        const chatRoom = createChatRoom(currentUserID, houseOwnerID);
        const chatMessage = new ChatMessage({
            sender: currentUserID,
            receiver: houseOwnerID,
            message: message
        });

        chatMessage.save()
            .then(savedMessage => {
                io.to(chatRoom).emit('message', { sender: currentUserID, message });

                if (currentUserID !== houseOwnerID) {
                    // Emit newMessage event specifically for the owner
                    io.to(ownerSocketId).emit('newMessage', {
                        sender: currentUserID,
                        message
                    });
                }

                console.log('Message sent:', savedMessage);
            })
            .catch(error => {
                console.error('Failed to save chat message:', error);
            });
    });




    socket.on('makeReservation', ({ currentUserID, houseOwnerID, houseID, dates }) => {
        const reservation = new Reservation({
            sender: currentUserID,
            receiver: houseOwnerID,
            house: houseID,
            dates: dates
        });

        reservation.save()
            .then(savedReservation => {
                io.emit('reservationMade', savedReservation); // Emit event to notify about the new reservation
                console.log('Reservation made:', savedReservation);
            })
            .catch(error => {
                console.error('Failed to save reservation:', error);
            });
    });




    socket.on('disconnect', () => {
        console.log('A user disconnected');

        // Handle disconnection of the owner
        if (socket.id === ownerSocketId) {
            ownerSocketId = null;
        }
    });
});




app.get('/chat-messages', (req, res) => {
    ChatMessage.find()
        .then((messages) => {
            res.json(messages);
        })
        .catch((error) => {
            console.error('Failed to retrieve chat messages:', error);
            res.status(500).json({ error: 'Failed to retrieve chat messages' });
        });
});


app.get('/Allreservations', async(req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        console.error('Failed to get reservations:', error);
        res.status(500).json({ error: 'Failed to get reservations' });
    }
});


app.delete('/DeleteReservations/:id', async(req, res) => {
    const reservationID = req.params.id;

    try {
        const deletedReservation = await Reservation.findByIdAndDelete(reservationID);

        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        console.log(`Reservation with ID ${reservationID} deleted successfully`);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('Failed to delete reservation:', error);
        res.status(500).json({ error: 'Failed to delete reservation' });
    }
});



mongoose.Promise = global.Promise;
mongoose
    .connect(dbConfig.db, {
        useNewUrlParser: true,
    })
    .then(
        () => {
            console.log("Connected to database");
        },
        (error) => {
            console.log("Error connecting" + error);
        }
    );



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/images");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: Infinity,
    },
});
app.use("/photos", express.static("uploads/images"));

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message,
        });
    }
}


/*
app.get("/", (req, res) => {
    res.send("Hello NODE API");
});

app.get("/oo", (req, res) => {
    res.send("Hello");
});

app.listen(3030, () => {
    console.log(`Node API app is running on port 3030`);
});
*/


app.get("/getAllUsers", async(req, res) => {
    try {
        const users = await User.find().select("nom email");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve users", error: err });
    }
});

app.delete("/deleteUser/:id", async(req, res) => {
    const userId = req.params.id;

    try {
        // Find and remove the user from the database
        await User.findByIdAndRemove(userId);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete user", error: err });
    }
});



app.put("/changePassword", async(req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        // If the user doesn't exist, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, user.password2);

        // If the passwords don't match, return an error
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid current password" });
        }

        // Generate a new hashed password for the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        user.password2 = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/getUser/:id", async(req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).select("nom email");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve user", error: err });
    }
});

app.get("/HousesList", (req, res) => {
    Promise.all([
            Villa.find(),
            Maison.find(),
            Appartement.find(),
            MaisonHote.find(),
            ChambrePartage.find(),
        ])
        .then(([villas, maisons, appartements, maisonsHotes, chambresPartages]) => {
            const houses = [
                ...villas,
                ...maisons,
                ...appartements,
                ...maisonsHotes,
                ...chambresPartages,
            ];
            res.json(houses);
        })
        .catch((err) => {
            console.log("hedha houwa", err);
            res.json(err);
        });
});

app.get("/GetHouse/:id", (req, res) => {
    const id = req.params.id;
    Promise.all([
            Villa.findById(id),
            Maison.findById(id),
            Appartement.findById(id),
            MaisonHote.findById(id),
            ChambrePartage.findById(id),
        ])
        .then(([villa, maison, appartement, maisonHote, chambrePartage]) => {
            const house =
                villa || maison || appartement || maisonHote || chambrePartage;
            if (house) {
                res.json(house);
            } else {
                res.status(404).send("House not found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

app.put("/UpdateHouse/:id", upload.array("photos", 4), async(req, res) => {
    try {
        const houseId = req.params.id;
        const fileUrls = [];
        const ownerId = req.body.owner;

        if (req.files) {
            for (const file of req.files) {
                fileUrls.push(`http://localhost:3030/photos/${file.filename}`);
            }
        }

        const {
            selectedtype,
            selectedOption,
            etat,
            date1,
            date2,
            region,
            delegation,
            localite,
            cp,
            surface,
            chambre,
            lits,
            sdb,
            prix,
            titre,
            description,
            icons,
            localisation,
        } = req.body;

        let updatedHouse;
        console.log("type", selectedtype);

        switch (selectedtype) {
            case "Appartement":
                updatedHouse = await Appartement.findByIdAndUpdate(
                    houseId, {
                        owner: ownerId,
                        selectedtype,
                        selectedOption,
                        etat,
                        date1,
                        date2,
                        region,
                        delegation,
                        localite,
                        cp,
                        surface,
                        chambre,
                        lits,
                        sdb,
                        prix,
                        photos: fileUrls,
                        titre,
                        description,
                        icons,
                        localisation,
                    }, { new: true }
                );
                break;
            case "Villa":
                updatedHouse = await Villa.findByIdAndUpdate(
                    houseId, {
                        owner: ownerId,
                        selectedtype,
                        selectedOption: "0",
                        etat,
                        date1,
                        date2,
                        region,
                        delegation,
                        localite,
                        cp,
                        surface,
                        chambre,
                        lits,
                        sdb,
                        prix,
                        photos: fileUrls,
                        titre,
                        description,
                        icons,
                        localisation,
                    }, { new: true }
                );
                break;
            case "Maison":
                updatedHouse = await Maison.findByIdAndUpdate(
                    houseId, {
                        owner: ownerId,
                        selectedtype,
                        selectedOption: "0",
                        etat,
                        date1,
                        date2,
                        region,
                        delegation,
                        localite,
                        cp,
                        surface,
                        chambre,
                        lits,
                        sdb,
                        prix,
                        photos: fileUrls,
                        titre,
                        description,
                        icons,
                        localisation,
                    }, { new: true }
                );
                break;
            case "maison d'hôte":
                updatedHouse = await MaisonHote.findByIdAndUpdate(
                    houseId, {
                        owner: ownerId,
                        selectedtype,
                        selectedOption: "0",
                        etat,
                        date1,
                        date2,
                        region,
                        delegation,
                        localite,
                        cp,
                        surface,
                        chambre,
                        lits,
                        sdb,
                        prix,
                        photos: fileUrls,
                        titre,
                        description,
                        icons,
                        localisation,
                    }, { new: true }
                );
                break;
            case "chambre partagé":
                updatedHouse = await ChambrePartage.findByIdAndUpdate(
                    houseId, {
                        owner: ownerId,
                        selectedtype,
                        selectedOption,
                        etat,
                        date1,
                        date2,
                        region,
                        delegation,
                        localite,
                        cp,
                        surface,
                        chambre,
                        lits,
                        sdb,
                        prix,
                        photos: fileUrls,
                        titre,
                        description,
                        icons,
                        localisation,
                    }, { new: true }
                );
                break;
            default:
                return res.status(400).json({ message: "Invalid house type selected" });
        }

        if (!updatedHouse) {
            return res.status(404).json({ message: "House not found" });
        }

        res
            .status(200)
            .json({ message: "House updated successfully", house: updatedHouse });
    } catch (error) {
        res.status(500).json({ message: "Failed to update house", error: error });
    }
});

app.delete("/DeleteHouse/:id", (req, res) => {
    const id = req.params.id;

    Promise.all([
            Villa.findByIdAndDelete(id),
            Maison.findByIdAndDelete(id),
            Appartement.findByIdAndDelete(id),
            MaisonHote.findByIdAndDelete(id),
            ChambrePartage.findByIdAndDelete(id),
        ])
        .then(([villa, maison, appartement, maisonHote, chambrePartage]) => {
            const deletedHouse =
                villa || maison || appartement || maisonHote || chambrePartage;
            if (deletedHouse) {
                res.status(200).send("House deleted successfully");
            } else {
                res.status(404).send("House not found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/register", async(req, res) => {
    const { nom, email, password1, password2 } = req.body;

    // validate user input
    if (!nom || !email || !password1 || !password2) {
        return res.status(400).json({ message: "All fields are required ooo" });
    }

    if (password1 !== password2) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password1, saltRounds);

        // create a new user
        const newUser = new User({
            nom,
            email,
            password2: hashedPassword,
        });

        // save the new user to the database
        await newUser.save();

        // send a response to the client
        res.json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    // find the user by email
    const user = await User.findOne({ email });

    // if no user is found, return an error message
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare the hashed password with the entered password
    const isMatch = await bcrypt.compare(password, user.password2);

    // if the passwords don't match, return an error message
    if (!isMatch) {
        console.log("aaaaaa");
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // store the user ID in the session
    req.session.userId = user.id;

    // log the user ID
    console.log("User ID:", user.id);

    // log the session
    console.log("Session:", req.session);

    // create a response object with the user ID and name
    const response = {
        userId: user.id,
        userName: user.nom,
    };
    console.log("name:", response.userName);

    // return the response
    res.json(response);
});

const requireLogin = async(req, res, next) => {
    const userId = req.body.owner;
    // console.log(userId)

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized one" });
    }

    try {
        const user = await User.findById(userId);
        // console.log('user', user)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized two" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};



app.post("/AddHouse", async(req, res) => {

    try {
        const photos = [];
        const ownerId = req.body.owner;



        if (Array.isArray(req.body.photos)) {
            photos.push(...req.body.photos);
        }
        console.log("photosaaray : ", photos);

        const {
            selectedtype,
            etage,
            etat,
            asenceur,
            garage,
            piscine,
            calendrier,
            region,
            delegation,
            localite,
            cp,
            surface,
            chambre,
            lits,
            sdb,
            prix,
            titre,
            description,
            localisation,
        } = req.body;

        let newHouse;
        console.log("type", selectedtype);

        switch (selectedtype) {
            case "Appartement":
                newHouse = new Appartement({
                    owner: ownerId,
                    selectedtype,
                    etage,
                    etat,
                    asenceur,
                    calendrier,
                    region,
                    delegation,
                    localite,
                    cp,
                    surface,
                    chambre,
                    lits,
                    sdb,
                    prix,
                    photos: photos,
                    titre,
                    description,
                    icons: req.body.icons,
                    localisation,
                    datedepublication: new Date(),
                });

                break;
            case "Villa":
                newHouse = new Villa({
                    owner: ownerId,
                    selectedtype,
                    etage: "pas d'étage",
                    etat,
                    piscine,
                    calendrier,
                    region,
                    delegation,
                    localite,
                    cp,
                    surface,
                    chambre,
                    lits,
                    sdb,
                    prix,
                    photos: photos,
                    titre,
                    description,
                    icons: req.body.icons,
                    localisation,
                    datedepublication: new Date(),
                });
                break;
            case "Maison":
                newHouse = new Maison({
                    owner: ownerId,
                    selectedtype,
                    etage: "pas d'étage",
                    etat,
                    garage,
                    calendrier,
                    region,
                    delegation,
                    localite,
                    cp,
                    surface,
                    chambre,
                    lits,
                    sdb,
                    prix,
                    photos: photos,
                    titre,
                    description,
                    icons: req.body.icons,
                    localisation,
                    datedepublication: new Date(),
                });
                break;
            case "maison d'hôte":
                newHouse = new MaisonHote({
                    owner: ownerId,
                    selectedtype,
                    etage: "pas d'étage",
                    etat,
                    calendrier,
                    region,
                    delegation,
                    localite,
                    cp,
                    surface,
                    chambre,
                    lits,
                    sdb,
                    prix,
                    photos: photos,
                    titre,
                    description,
                    icons: req.body.icons,
                    localisation,
                    datedepublication: new Date(),
                });
                break;
            case "chambre partagé":
                newHouse = new ChambrePartage({
                    owner: ownerId,
                    selectedtype,
                    etage,
                    etat,
                    calendrier,
                    region,
                    delegation,
                    localite,
                    cp,
                    surface,
                    chambre,
                    lits,
                    sdb,
                    prix,
                    photos: photos,
                    titre,
                    description,
                    icons: req.body.icons,
                    localisation,
                    datedepublication: new Date(),
                });
                break;
            default:
                return res.status(400).json({ message: "Invalid house type selected" });
        }
        // console.log(icons)

        await newHouse.save();
        const response = {
            message: "House added successfully",
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Failed to add house", error: error });
    }
});