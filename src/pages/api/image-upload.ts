// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { authOptions as nextAuthOptions } from './auth/[...nextauth]';

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  secure: true,
});

const imageUploadHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, nextAuthOptions);
    if (session) {
      try {
        const result = await cloudinary.uploader.upload(req.body.imageBase64);
        res.status(201).json({ uploadedImageUrl: result.secure_url });
      } catch (error) {
        console.error(error);
        res.status(500).json('Error uploading image to Cloudinary');
      }
    } else {
      res.status(401).json('Must be signed in to upload images');
    }
  }
};

export default imageUploadHandler;
