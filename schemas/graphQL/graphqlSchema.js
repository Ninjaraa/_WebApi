const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = graphql

const Vendor = require('../vendorSchema')
const Product = require('../productSchema')

const VendorType = new GraphQLObjectType({
    name: 'Vendor',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return Product.find({ vendorId: parent._id })
            }
        }
    })
})

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        label: { type: GraphQLString },
        description: { type: GraphQLString },
        category: { type: GraphQLString },
        imageName: { type: GraphQLString },
        vendor: {
            type: VendorType,
            resolve(parent, args) {
                return Vendor.findById(parent.vendorId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // A vendor
        vendor: {
            type: VendorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Vendor.findById(args.id)
            }
        },
        // All vendors
        vendors: {
            type: new GraphQLList(VendorType),
            resolve(parent, args) {
                return Vendor.find({})
            }
        },
        // A product
        product: {
            type: ProductType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Product.findById(args.id)
            }
        },
        // All products
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return Product.find({})
            }
        },
    }
})

// Create a vendor
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addVendor: {
            type: VendorType,
            args: {
                name: { type: GraphQLString },
            },
            resolve(parent, args) {
                const vendor = new Vendor({
                    name: args.name
                })
                return vendor.save()
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                name: { type: GraphQLString },
                price: { type: GraphQLString },
                label: { type: GraphQLString },
                description: { type: GraphQLString },
                category: { type: GraphQLString },
                imageName: { type: GraphQLString },
                vendorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                const product = new Product({
                    // Params in
                    name: args.name,
                    price: args.price,
                    label: args.label,
                    description: args.description,
                    category: args.category,
                    imageName: args.imageName,
                    vendorId: args.vendorId
                })
                return product.save()
            }
        },

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})