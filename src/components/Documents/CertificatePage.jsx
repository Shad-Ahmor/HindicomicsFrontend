import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CertificatePage.css';
import api from '../api';
import html2canvas from 'html2canvas'; // ✅ Changed from html2pdf to html2canvas

const CertificatePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token missing. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching logged-in user data:', err);
                setError('Failed to fetch user information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLoggedInUser();
    }, []);

    const downloadCertificate = async () => {
        if (!user) {
            alert('User data not loaded yet. Please wait.');
            return;
        }

        const element = document.getElementById('certificate-content');
        if (!element) {
            console.error('Certificate content element not found!');
            alert('Failed to find certificate content. Please try again.');
            return;
        }

        // Hide the download button container before taking the screenshot
        const downloadButtonContainer = document.querySelector('.download-btn-container');
        if (downloadButtonContainer) {
            downloadButtonContainer.style.display = 'none';
        }

        try {
            // ✅ Use html2canvas to render the element to a canvas
            const canvas = await html2canvas(element, {
                scale: 2, // You can adjust this scale for higher resolution (e.g., 2 or 3)
                logging: true, // Log details for debugging
                useCORS: true, // Important if you have images from other domains (e.g., QR code, logos)
                backgroundColor: null, // Allow transparent background if your certificate has one
            });

            // ✅ Get the image data as a PNG
            const imgData = canvas.toDataURL('image/png');

            // ✅ Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `Internship_Certificate_${user.name.replace(/\s+/g, '_') || user.id}.png`; // Set filename for PNG
            document.body.appendChild(link); // Append to body
            link.click(); // Programmatically click the link
            document.body.removeChild(link); // Remove the link

        } catch (err) {
            console.error('Error generating certificate image:', err);
            alert('Failed to download certificate image. Please try again. Check console for details.');
        } finally {
            // Always show the download button container again
            if (downloadButtonContainer) {
                downloadButtonContainer.style.display = 'block';
            }
        }
    };

    // Render loading, error, or no user state
    if (loading) {
        return <div className="text-center mt-5">Loading user info...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    if (!user) {
        return <div className="text-center mt-5">No user data available.</div>;
    }

    // Helper function to determine internship duration
    const getInternshipDurationText = () => {
        const plan = user.selectedInternshipPlan?.toLowerCase();
        if (plan === 'pro') return '6 months';
        if (plan === 'plus') return '3 months';
        return '2 months';
    };

    // Default values for performance evaluation if not available from user data
    const performanceEvaluation = {
        technical: user.performance?.technicalRating || 4,
        communication: user.performance?.communicationRating || 5,
        punctuality: user.performance?.punctualityRating || 5,
        overallRanking: user.performance?.overallRanking || 'Excellent',
    };

    const getContributionSummary = () => {
        if (user.project === 'Hindi-Comics') {
            return "Contributed significantly to the development and enhancement of the 'Hindi-Comics' platform, including UI/UX improvements and backend integration.";
        }
        return "Actively participated in various phases of the project life cycle, demonstrating strong problem-solving skills and teamwork.";
    };

    // Make sure your QR code URL is correct and accessible
    const qrCodeUrl = `https://gdlsoftware.com/verify-certificate?internId=${user.id}`; // ✅ Ensure this domain is correct

    return (
        <div className="certificate-page-container">
            {/* Download Button Section */}
            <div className="download-btn-container">
                <button onClick={downloadCertificate} className="btn btn-sm">
                    Download PNG Certificate
                </button>
            </div>

            {/* Main Certificate Content Area */}
            <div id="certificate-content" className="certificate-border">
                <div className="certificate-inner-content">
                    {/* Header with Logos */}
                    <div className="logos-header">
                        <img src="/images/gdllogo.png" alt="GdlSoftware Logo" className="logo company-logo" />
                        <img src="/images/hindicomicslogo.png" alt="Hindi-Comics Logo" className="logo product-logo" />
                    </div>

                    {/* Certificate Title */}
                    <h1 className="certificate-title">CERTIFICATE OF INTERNSHIP</h1>
                    <p className="certificate-text-intro">THIS CERTIFIES THAT</p>
                    <h2 className="certificate-name">{user.name}</h2>

                    {/* Main Body Text */}
                    <p className="certificate-text">
                        has successfully completed an internship as a <strong>{user.subrole || user.role}</strong> at <strong>GdlSoftware</strong>, a leading Android app, website, and software-based product & service company.
                    </p>


                    {/* Performance Evaluation Section */}
                    <div className="performance-evaluation-section">
                        <h3 className="evaluation-title">INTERN PERFORMANCE EVALUATION</h3>
                        <p className="certificate-text">
                        <strong>Project Name:</strong> {user.project || 'Hindi Comics'}
                    </p>
                    <p className="certificate-text">
                        <strong>Internship Duration:</strong> {getInternshipDurationText()}
                    </p>
                    <p className="certificate-text">
                        <strong>Intern Contribution Summary:</strong> {getContributionSummary()}
                    </p>
                        <div className="evaluation-ratings">

                            <p>⭐ Technical Proficiency: {performanceEvaluation.technical} / 5</p>
                            <p>⭐ Communication & Collaboration: {performanceEvaluation.communication} / 5</p>
                            <p>⭐ Punctuality & Responsibility: {performanceEvaluation.punctuality} / 5</p>
                        </div>
                        <p className="overall-ranking"><strong>Overall Intern Ranking:</strong> {performanceEvaluation.overallRanking}</p>
                    </div>

                    {/* Signature and Seal Section */}
                    <div className="signature-and-seal-section">
                        <div className="company-seal-area">
                        {qrCodeUrl && (
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrCodeUrl)}`} alt="QR Code for Verification" className="qr-code" />
                        )}
                        <p className="footer-link">www.gdlsoftware.com</p>
                        <p className="footer-link">support@gdlsoftware.com</p>

                        </div>
                        <div className="authorized-signature-area text-center">
                            <img src="/images/authorized_signature.png" alt="Authorized Signature" className="authorized-signature-img" />
                            <p className="signature-line">______________________</p>
                            <p className="signature-name">[Authorized Signatory Name]</p>
                            <p className="signature-title">[Title, e.g., Project Supervisor, HR Head]</p>
                            <p className="issue-date">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default CertificatePage;