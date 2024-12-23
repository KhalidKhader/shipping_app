import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";

const UploadComponent = () => {
    const [email, setEmail] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setErrorMessage(""); 
        setSuccessMessage(""); 

        if (selectedFile) {
            const validTypes = ["application/vnd.ms-excel", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
            if (!validTypes.includes(selectedFile.type)) {
                setErrorMessage("Invalid file type. Please upload a CSV or Excel (.xlsx) file.");
                setFile(null);
            } else if (selectedFile.size > 10 * 1024 * 1024) {
                setErrorMessage("File size exceeds 10MB. Please upload a smaller file.");
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMessage("Please select a file first.");
            return;
        }

        if (!email) {
            setErrorMessage("Please provide an email.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", email);

        try {
            const response = await axios.post("http://127.0.0.1:8000/upload-user-rates/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage("File uploaded successfully!"); 
        } catch (error) {
            setErrorMessage("Error uploading file: " + (error.response ? error.response.data.error : error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 4, backgroundColor: "#f4f4f9", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Upload Your File
            </Typography>

            <TextField
                fullWidth
                label="Enter your email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
            />

            {email && (
                <Typography variant="body2" color="textSecondary" align="center">
                    Logged in as: {email}
                </Typography>
            )}

            <TextField
                fullWidth
                type="file"
                variant="outlined"
                onChange={handleFileChange}
                margin="normal"
                inputProps={{ accept: ".csv, .xls, .xlsx" }}
            />

            {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>} {/* Display error message */}

            {successMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{successMessage}</Alert>} {/* Display success message */}

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                sx={{ marginBottom: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : "Upload File"}
            </Button>

            <Typography variant="h6" align="center" sx={{ marginTop: 4, marginBottom: 2 }}>
                Welcome to the app
            </Typography>
        </Container>
    );
};

export default UploadComponent;
