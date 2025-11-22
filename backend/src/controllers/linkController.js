const Link = require('../models/Link');
const { v4: uuidv4 } = require('uuid');

const generateRandomCode = () => {
  // Generate a UUID and use the first 6 alphanumeric characters
  return uuidv4().replace(/-/g, '').slice(0, 6);
};


//Create-a-Link controller
const createLink = async (req, res) => {
  try {
    const { targetUrl, code } = req.body;//from frontedn we get these two values
    //the target url is the original url and
    //code is the custom short url if user want to provide

    if (!targetUrl) {
      return res.status(400).json({
        error: 'Target URL is required',
        code: 'MISSING_TARGET_URL'
      });
    }


    //verify URL format 
    try {
      new URL(targetUrl);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format',
        code: 'INVALID_URL_FORMAT'
      });
    }

    //custom url small code or shorten url
    let finalCode = code;

    if (finalCode) {

      if (!/^[A-Za-z0-9]{6,8}$/.test(finalCode)) {
        return res.status(400).json({
          error: 'Custom code must be 6-8 alphanumeric characters',
          code: 'INVALID_CODE_FORMAT'
        });
      }

      //check if code url already exists or not
      const existingLink = await Link.findOne({ code: finalCode });
      //if link alreasdy exists we return error
      if (existingLink) {
        return res.status(409).json({
          error: 'Code already exists',
          code: 'CODE_EXISTS'
        });
      }
    }
    else {
      //if no custom code is provided
      // Tries up to 10 times to generate a random 6-character code that doesn’t already exist in the database.
      // If it can’t find a unique code after 10 tries, returns a 500 error.
      finalCode = generateRandomCode();
      const existingLink = await Link.findOne({ code: finalCode });
      if (existingLink) {
        return res.status(500).json({
          error: 'Failed to generate unique code',
          code: 'CODE_GENERATION_FAILED'
        });
      }
    }

    //creating and saving the link
    const link = new Link({
      code: finalCode,
      targetUrl
    });

    await link.save();//saving the document in the database

    res.status(201).json({
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      clicks: link.clicks,
      createdAt: link.createdAt
    });

  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

//Get-All-Links Controller
const getLinks = async (req, res) => {
  try {

    //Finding and Fetching all links from database
    const links = await Link.find().sort({ createdAt: -1 });

    res.json(links.map(link => ({
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    })));
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

//Get-Link_Statastics Controller
const getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({
        error: 'Link not found',
        code: 'LINK_NOT_FOUND'
      });
    }

    res.json({
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    });
  } catch (error) {
    console.error('Get link stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

//Delete a Link Controller
const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOneAndDelete({ code });

    if (!link) {
      return res.status(404).json({
        error: 'Link not found',
        code: 'LINK_NOT_FOUND'
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

//Redirect to a Link Controller
const redirectToTarget = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({
        error: 'Link not found',
        code: 'LINK_NOT_FOUND'
      });
    }

    link.clicks += 1;//increments the clicks field by 1 (tracks how many times the short URL has been used).
    link.lastClicked = new Date();//Updates lastClicked to the current date and time.
    await link.save();//Saves these changes back to the database.

    res.redirect(302, link.targetUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

module.exports = {
  createLink,
  getLinks,
  getLinkStats,
  deleteLink,
  redirectToTarget
};