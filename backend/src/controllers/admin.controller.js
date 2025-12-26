import cloudinary from '../config/cloudinary.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';




export async function createProduct(req, res) {

try {
    const {name, description, price, category, images} = req.body;

    if (!name || !description || !price || !category || !images) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'You must upload at least one image' });
    }

    if (req.files.length > 3) {
        return res.status(400).json({ message: 'You can upload maximum three images' });
    }

    const uploadPromises = req.files.map((file) => {
    return cloudinary.uploader.upload(file.path,{
        folder:'products'
    })   
})

    const uploadedResults = await Promise.all(uploadPromises);
    const imageUrls = uploadedResults.map((result) => result.secure_url);

    const product = await Product.create({
        name,
        description,
        price:parseFloat(price),
        category,
        stock: parseInt(stock),
        images: imageUrls
    });

    res.status(201).json({ message: 'Product created successfully', product });

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}

    
};

export async function getAllProduct(_, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    } 
};

export async function updateProduct(req, res) {
    try {

        const { id } = req.params;
        const {name, description, price, category, stock} = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
 
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (category) product.category = category;
        if (stock !== undefined) product.stock = parseInt(stock);

        if(req.files && req.files.length > 0) {
          if(req.files.length > 0) {
           return res.status(400).json({ message: 'You can upload maximum three images' });
        
        }
          const uploadPromises = req.files.map((file) => {
          return cloudinary.uploader.upload(file.path,{
              folder:'products'
          })   
      })
        
         const uploadedResults = await Promise.all(uploadPromises);
        product.images = uploadedResults.map((result) => result.secure_url);
       
        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

};


export async function getAllOrders(_, res) {
    try {
        const orders = await Order.find()
        .populate('user', 'name email')
        .populate('orderItems.product')
        .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
};
 

export async function updateOrderStatus(req, res) {

    try {
        const { orderId } = req.params;
        const { status } = req.body;

       if(!['pending', 'shipped', 'delivered', 'cancelled'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });

       const order = await Order.findById(orderId);
       if(!order) {
        return res.status(404).json({ message: 'Order not found' });
       }

       order.status = status;

       if (status === 'shipped' && !order.shippedAt) {
           order.shippedAt = Date.now();
       }
       
       if (status === 'delivered' && !order.deliveredAt) {
           order.deliveredAt = Date.now();
       }

       await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }

}


export async function getAllCustomers(_, res) {
    try {
        const customers = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ customers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getDashboardStatus(_, res) {
    try {
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                },
            },
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({ totalOrders, totalRevenue, totalCustomers, totalProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
