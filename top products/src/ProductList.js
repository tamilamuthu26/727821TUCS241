import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [topN, setTopN] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
  const categories = [
    'phone', 'computer', 'tv', 'earphone', 'tablet', 'charger', 
    'mouse', 'keypad', 'bluetooth', 'pendrive', 'remote', 'speaker', 'headset', 'laptop', 'pc'
  ];

  // Sample data for products
  const initialProducts = [
    {
      id: 1,
      name: 'Smartphone XYZ',
      company: 'AMZ',
      category: 'phone',
      price: 499.99,
      imageUrl: 'https://via.placeholder.com/300?text=Smartphone+XYZ',
      rating: 4,
      discount: 15,
      available: true
    },
    {
      id: 2,
      name: 'Laptop ABC',
      company: 'FLP',
      category: 'laptop',
      price: 1299.99,
      imageUrl: 'https://via.placeholder.com/300?text=Laptop+ABC',
      rating: 5,
      discount: 10,
      available: true
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      company: 'SNP',
      category: 'speaker',
      price: 79.99,
      imageUrl: 'https://via.placeholder.com/300?text=Bluetooth+Speaker',
      rating: 4,
      discount: 20,
      available: false
    },
    {
      id: 4,
      name: 'Wireless Mouse',
      company: 'MYN',
      category: 'mouse',
      price: 29.99,
      imageUrl: 'https://via.placeholder.com/300?text=Wireless+Mouse',
      rating: 3,
      discount: 12,
      available: true
    },
    {
      id: 5,
      name: 'Tablet XYZ',
      company: 'AZO',
      category: 'tablet',
      price: 199.99,
      imageUrl: 'https://via.placeholder.com/300?text=Tablet+XYZ',
      rating: 4,
      discount: 18,
      available: true
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, company, topN]);

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const requests = companies.map(company =>
        axios.get(`http://20.244.56.144/test/companies/${company}/categories/${category}/products`, {
          params: { top: topN, minPrice: '', maxPrice: '' }
        })
      );

      const responses = await axios.all(requests);
      const productsFromAPI = responses.flatMap(response => response.data);

      const mergedProducts = initialProducts.map(product => {
        const matchedProduct = productsFromAPI.find(p => p.id === product.id);
        if (matchedProduct) {
          return {
            ...product,
            ...matchedProduct
          };
        }
        return product;
      });

      setProducts(mergedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Settings for the carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top {topN} Products</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <label htmlFor="category" className="mr-2">Category:</label>
          <select 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="company" className="mr-2">Company:</label>
          <select 
            id="company" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Company</option>
            {companies.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Slider {...carouselSettings}>
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="border p-4 rounded">
                <img src={product.imageUrl} alt={product.name} className="w-full mb-2 rounded" />
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-sm mb-2">{product.company}</p>
                <p className="text-sm mb-2">{product.category}</p>
                <p className="font-bold">${product.price}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-yellow-500">{product.rating}/5</span>
                  <span className="text-xs text-gray-500">(Discount: {product.discount}%)</span>
                </div>
                <p className={`text-sm ${product.available ? 'text-green-500' : 'text-red-500'}`}>
                  {product.available ? 'In Stock' : 'Out of Stock'}
                </p>
                <span className="text-blue-500 block mt-2">View Details</span>
              </div>
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductList;
