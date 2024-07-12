import React, { useState } from 'react';


function CreateStudent() {

    const defaultFormData = () => ({
        name: '',
        course: '',
        rate: '',
        currency: '',
        meetLink: 'example.com/meetLink',
        whiteboardLink: 'example.com/whiteboardLink',
        sessions: []
    });
    
    const [formData, setFormData] = useState(defaultFormData);

    const handleChange = (event, index) => {
        const eventName = event.target.name;
        const eventValue = event.target.value;
        if (eventName === 'taken' || eventName === 'paid') {
            const newSessions = [...formData.sessions];
            newSessions[index][eventName] = event.target.checked;
            setFormData({ ...formData, sessions: newSessions });
        } else {
            if (index !== undefined) {
                const newSessions = [...formData.sessions];
                newSessions[index][eventName] = eventValue;
                setFormData({ ...formData, sessions: newSessions });
            } else {
                setFormData({ ...formData, [eventName]: eventValue });
            }
        }
    };

    const addSession = () => {
        setFormData({
            ...formData,
            sessions: [
            ...formData.sessions,
            {
                date: '',
                price: '',
                pdf: 'example.com/pdf',
                taken: false,
                paid: false
            }
            ]
        });
    };

    const removeSession = (indexToRemove) => {
        const newSessions = formData.sessions.filter((session, index) => index !== indexToRemove);
        setFormData({ ...formData, sessions: newSessions });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/students/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Student created successfully');
                setFormData(defaultFormData);
            } else {
                console.error('Error creating student:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating student:', error.message);
        }
    };
    

    return (

        <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg">

            <pre>{JSON.stringify(formData, null, 2)}</pre>

            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">Course</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="course" type="text" placeholder="Course" name="course" value={formData.course} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="flex items-center col-span-3">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="rate">Rate</label>
                    </div>
                    <div className="flex items-center col-span-2">
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="currency">Currency</label>
                    </div>
                    <div className="col-span-3">
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="rate" type="number" placeholder="Rate" name="rate" value={formData.rate} onChange={handleChange} required />
                    </div>
                    <div className = "col-span-2">
                        <select className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formData.currency === '' ? 'text-gray-400' : ''}`} value={formData.currency} name="currency" onChange={handleChange}>
                        <option value="" style={{ color: '#6b7280' }}>Select</option>
                        <option value="e" style={{ color: '#000000' }}>€ (EUR)</option>
                        <option value="s" style={{ color: '#000000' }}>$ (USD)</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meetLink">Meet Link</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="meetLink" type="text" placeholder="Meet Link" name="meetLink" value={formData.meetLink} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whiteboardLink">Whiteboard Link</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="whiteboardLink" type="text" placeholder="Whiteboard Link" name="whiteboardLink" value={formData.whiteboardLink} onChange={handleChange} required />
                </div>

                {/* Sessions */}
                {formData.sessions.map((session, index) => (
                    <div key={index}>
                        <h2 className="text-lg font-bold mb-2">Session {index + 1}</h2>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`date_${index}`}>Date</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={`date_${index}`} type="date" placeholder="Date" name="date" value={session.date} onChange={(e) => handleChange(e, index)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`price_${index}`}>Price</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={`price_${index}`} type="number" placeholder="Price" name="price" value={session.price} onChange={(e) => handleChange(e, index)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`pdf_${index}`}>PDF URL</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={`pdf_${index}`} type="text" placeholder="PDF URL" name="pdf" value={session.pdf} onChange={(e) => handleChange(e, index)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`taken_${index}`}>
                        <input type="checkbox" id={`taken_${index}`} name="taken" checked={session.taken} onChange={(e) => handleChange(e, index)} />
                        <span className="ml-2">Taken</span>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`paid_${index}`}>
                        <input type="checkbox" id={`paid_${index}`} name="paid" checked={session.paid} onChange={(e) => handleChange(e, index)} />
                        <span className="ml-2">Paid</span>
                        </label>
                    </div>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => removeSession(index)}>Remove Session</button>
                    </div>
                ))}

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" type="button" onClick={addSession}>Add Session</button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4" type="submit" onClick={handleSubmit}>Submit</button>

            </form>

        </div>
    );
}

export default CreateStudent;