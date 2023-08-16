const puppeteer = require('puppeteer');
const axios = require('axios');
const User = require("../model/user");

const data = {
    list : []
}

const scrapUrl = async (req, res) => {

  const flipkartURL = req.body.url;
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(500).json({ message: "User not found by this Id!!!" });
    }
        
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    await page.goto(`${flipkartURL}`, {
        timeout:0,
        waitUntil:'networkidle0',
    })
    const productData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('div[data-id]')
        items.forEach((item, index) => {
            console.log(`scraping data of product: ${index}`)
            const id = item.getAttribute('data-id')
            const name = item.querySelector('div._4rR01T') && item.querySelector('div._4rR01T').innerText
            const price = item.querySelector('div._30jeq3') && item.querySelector('div._30jeq3').innerText
            const rating = item.querySelector('div._3LWZlK') && item.querySelector('div._3LWZlK').innerText
            const description = item.querySelector('div.fMghEO') && item.querySelector('div.fMghEO').innerText
            
            data.list.push({
                id:id,
                title:name,
                price : price,
                rating:rating,
                description:description,
               
            })
        })
        return data;
        }, data)

        console.log(`successfully collected ${productData.list.length} products`)

        let jsonData = JSON.stringify(productData);

        user.urls.push(jsonData);
        await user.save();
        return res.status(201).json(jsonData);       
    
  } catch (error) {
    return res.status(500).json({message : error});
  }      
    
}

module.exports = { scrapUrl };









