const express = require('express');
const certificateRoutes = express.Router();
const multer = require('multer');
const ApplyCertificateForm = require('../../models/aknuform/CertificateFormSchema');
const authenticationMiddleware = require('../../middlewares/authentication');

// Multer Setup
const storage = multer.memoryStorage(); // This will store file in buffer
const upload = multer({ storage: storage });

// POST Route with File Upload
certificateRoutes.post('/apply-certificate', upload.single('uploadDocuments'), async (req, res) => {
  try {
    const file = req.file;

    const formData = new ApplyCertificateForm({
      ...req.body,
      uploadDocuments: file ? {
        data: file.buffer,
        contentType: file.mimetype,
        fileName: file.originalname
      } : undefined,
      termsAccepted: req.body.termsAccepted === 'true'
    });

    await formData.save();
    res.status(201).json({ message: 'Application submitted successfully!', data: formData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting application', error });
  }
});

// GET Route
certificateRoutes.get('/apply-certificate',authenticationMiddleware, async (req, res) => {
  try {
    const forms = await ApplyCertificateForm.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});
certificateRoutes.get('/file/:id' ,async (req, res) => {
    try {
        const formData = await ApplyCertificateForm.findById(req.params.id);

        if (!formData || !formData.uploadDocuments) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.set({
            'Content-Type': formData.uploadDocuments.contentType,
            'Content-Disposition': `inline; filename="${formData.uploadDocuments.fileName}"`,
        });

        res.send(formData.uploadDocuments.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching file', error });
    }
});


module.exports = certificateRoutes;
