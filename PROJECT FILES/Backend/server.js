const express = require('express');
const cors = require('cors');
const multer = require('multer');

require('./db/config'); // Ensure this connects to MongoDB cleanly

// Schemas
const Admin = require('./db/Admin/Admin');
const users = require('./db/Users/userschema');
const seller = require('./db/Seller/Sellers');
const items = require('./db/Seller/Additem');
const myorders = require('./db/Users/myorders');
const WishlistItem = require('./db/Users/Wishlist');

const app = express();
const PORT = 4000;

app.use(express.json());

// Enable CORS for frontend on Vite (port 5173)
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

// File uploads
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads')); // Serve images at http://localhost:4000/uploads/<filename>

// ---------------------------- Admin Routes ----------------------------

app.post('/alogin', async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (user && user.password === password) {
        res.json({ Status: "Success", user: { id: user.id, name: user.name, email: user.email } });
    } else {
        res.json("login fail");
    }
});

app.post('/asignup', async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.json("Already have an account");
    await Admin.create({ name, email, password });
    res.json("Account Created");
});

// ---------------------------- User Routes ----------------------------

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await users.findOne({ email });
    if (existing) return res.json("Already have an account");
    await users.create({ name, email, password });
    res.json("Account Created");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (user && user.password === password) {
        res.json({ Status: "Success", user: { id: user.id, name: user.name, email: user.email } });
    } else {
        res.json("Invalid Credentials");
    }
});

app.get('/users', async (req, res) => {
    const userList = await users.find();
    res.json(userList);
});

app.delete('/userdelete/:id', async (req, res) => {
    await users.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

// ---------------------------- Seller Routes ----------------------------

app.post('/ssignup', async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await seller.findOne({ email });
    if (existing) return res.json("Already have an account");
    await seller.create({ name, email, password });
    res.json("Account Created");
});

app.post('/slogin', async (req, res) => {
    const { email, password } = req.body;
    const user = await seller.findOne({ email });
    if (user && user.password === password) {
        res.json({ Status: "Success", user: { id: user.id, name: user.name, email: user.email } });
    } else {
        res.json("login fail");
    }
});

app.get('/sellers', async (req, res) => {
    const sellersList = await seller.find();
    res.json(sellersList);
});

app.delete('/sellerdelete/:id', async (req, res) => {
    await seller.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

// ---------------------------- Item Routes ----------------------------

app.post('/items', upload.single('itemImage'), async (req, res) => {
    const { title, author, genre, description, price, userId, userName } = req.body;
    const itemImage = req.file ? req.file.filename : '';
    const item = new items({ itemImage, title, author, genre, description, price, userId, userName });
    await item.save();
    res.status(201).json(item);
});

app.get('/item', async (req, res) => {
    const allItems = await items.find();
    res.json(allItems);
});

app.get('/item/:id', async (req, res) => {
    const item = await items.findById(req.params.id);
    res.json(item);
});

app.get('/getitem/:userId', async (req, res) => {
    const userItems = await items.find({ userId: req.params.userId });
    res.json(userItems);
});

app.delete('/itemdelete/:id', async (req, res) => {
    await items.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

// ---------------------------- Orders Routes ----------------------------

app.post('/userorder', async (req, res) => {
    const order = new myorders(req.body);
    await order.save();
    res.status(201).json(order);
});

app.get('/orders', async (req, res) => {
    const ordersList = await myorders.find();
    res.json(ordersList);
});

app.get('/getorders/:userId', async (req, res) => {
    const userOrders = await myorders.find({ userId: req.params.userId });
    res.json(userOrders);
});

app.delete('/userorderdelete/:id', async (req, res) => {
    await myorders.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

app.get('/getsellerorders/:userId', async (req, res) => {
    const sellerOrders = await myorders.find({ sellerId: req.params.userId });
    res.json(sellerOrders);
});

// ---------------------------- Wishlist Routes ----------------------------

app.get('/wishlist', async (req, res) => {
    const wishlist = await WishlistItem.find();
    res.json(wishlist);
});

app.get('/wishlist/:userId', async (req, res) => {
    const userWishlist = await WishlistItem.find({ userId: req.params.userId });
    res.json(userWishlist);
});

app.post('/wishlist/add', async (req, res) => {
    const { itemId, title, itemImage, userId, userName } = req.body;
    const existing = await WishlistItem.findOne({ itemId });
    if (existing) return res.status(400).json({ msg: 'Item already in wishlist' });
    const newItem = new WishlistItem({ itemId, title, itemImage, userId, userName });
    await newItem.save();
    res.json(newItem);
});

app.post('/wishlist/remove', async (req, res) => {
    await WishlistItem.findOneAndDelete({ itemId: req.body.itemId });
    res.json({ msg: 'Item removed from wishlist' });
});

// ---------------------------- Start Server ----------------------------

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
