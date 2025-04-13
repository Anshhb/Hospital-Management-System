
import React, { useState, useEffect } from 'react';
import Header from './components/header';

export default function SeeDocs() {
    const [degrees, setDegrees] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);
    const [loading, setLoading] = useState(true); // Default to true
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // const email = window.location.pathname.split('/')[2]; // Extract email from the URL
            try {
                const response = await fetch(`http://localhost:3001/seeDocs`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const result = await response.json();
                setDegrees(result.degrees);
                setCoverLetter(result.coverLetter);
            } catch (err) {
                setError('Failed to fetch documents.');
                console.error('Error fetching degrees and cover letter:', err);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>; // Show a loading indicator
    if (error) return <div>{error}</div>; // Show an error message if something went wrong

    return (
        <div className="flex flex-col items-center justify-center gap-4 bg-slate-500 m-0 p-0 overflow-auto">
            <Header />
            <h1 className='text-white text-2xl font-bold'>Degrees and Cover Letter</h1>
            <div className="flex flex-col items-center gap-2">
                <p>Degree:</p>
                {degrees ? (
                    <embed
                        src={`data:application/pdf;base64,${degrees}`}
                        width="600"
                        height="400"
                        type="application/pdf"
                    />
                ) : (
                    <p>No degrees found.</p>
                )}
            </div>
            <div className="flex flex-col items-center gap-2">
                <p>Cover Letter:</p>
                {coverLetter ? (
                    <embed
                        src={`data:application/pdf;base64,${coverLetter}`}
                        width="600"
                        height="400"
                        type="application/pdf"
                    />
                ) : (
                    <p>No cover letter found.</p>
                )}
            </div>
        </div>
    );
}
