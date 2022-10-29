const { UrlModel } = require("./urlSchema")
const { isEmpty } = require('lodash');

const postUrl = async (req,res) =>{

    try {
        const { url:incomingUrl = ''} = req.body || {}
        let isValidUrl = validateUrl(incomingUrl);
        if(!isValidUrl){
            return res.json({
                 error: 'invalid url' 
            })
        }
        
        let isUrlPresentInDb = await UrlModel.findOne({
            originalUrl:incomingUrl
        }) || {};
        //if url is not present then store in db
        if(isEmpty(isUrlPresentInDb)){
        
        let data = await UrlModel.findOne({}).sort({shortUrl:-1}) || {}
        let { originalUrl = '', shortUrl = ''} = data || {}; 
        let newShortUrlNumber = Number(shortUrl) + 1;
        let updaeQuery = new UrlModel ({
            originalUrl:incomingUrl,
            shortUrl:newShortUrlNumber
        })
        let savedData = await updaeQuery.save()
        return res.json({
            "original_url":incomingUrl,
            "short_url":newShortUrlNumber
        })
        }
        else { //if url is present the send the sama
            let { originalUrl = '', shortUrl = ''} = isUrlPresentInDb || {};
            return res.json({
                "original_url":incomingUrl,
                "short_url":shortUrl
            })
        }
        
    } 
    catch(error){
        console.log(`Error while posting url - Error: ${error}`)
        return
    }
    
}

const validateUrl = url => {
    const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    const reg = new RegExp(urlPattern);
    return reg.test(url)
}

const getUrl = async (req,res) => {
    try {
        let urlParams = req.params.shortUrlNum || '';
        let shortUrlNum = Number(urlParams)
        if(!shortUrlNum){
            return res.json({
                "error":"No short URL found"
            })
        }
        let data = await UrlModel.findOne({shortUrl:shortUrlNum}) || {};
        if(isEmpty(data)){
            return res.json({
                "error":"No short URL found"
            })
        }
        else {
            let { originalUrl = '', shortUrl = ''} = data || {}; 
            return res.redirect(originalUrl);
        }
    }
    catch(error){
        console.log(`Error while redirecting to original url- Error: ${error}`)
        return
    }

}

module.exports = {
    postUrl,
    getUrl
}