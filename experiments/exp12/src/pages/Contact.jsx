import React, { useState } from 'react';

function Contact() {
    const [msg, setMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Your inquiry has been submitted. Thank you!");
        setMsg('');
    };

    return (
        <div className="row">
            <div className="col-md-6 mx-auto">
                <div className="card p-4 shadow-sm bg-white mt-4">
                    <h3 className="mb-3 text-secondary">Contact Support</h3>
                    <p className="text-muted">For admissions and campus queries, submit a message below:</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Your Message</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-secondary w-100">Submit Inquiry</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;