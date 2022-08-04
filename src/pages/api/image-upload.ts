// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  secure: true,
});

const imageUploadHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    try {
      const result = await cloudinary.uploader.upload(req.body.imageBase64);
      res.status(201).json({ uploadedImageUrl: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json('Error uploading image to Cloudinary');
    }
  }
};

export default imageUploadHandler;
