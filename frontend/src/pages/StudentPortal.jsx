import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { set } from 'mongoose';


function StudentPortal() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [selectedSection, setSelectedSection] = useState('information');

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/student/${studentId}`);
        const data = await response.json();
        setStudent(data.student);
        setSessions(data.student.sessions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [studentId]);
  
  const [inputDate, setInputDate] = useState('');
  const [inputPrice, setInputPrice] = useState('');

  const handleRequestSession = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3000/api/student/${studentId}/schedule`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: inputDate,
                price: inputPrice,
            })
        });
        if (response.ok) {
            console.log('Session scheduled successfully');
            setInputDate('');
            setInputPrice('');

            const updatedSessions = [...sessions, {
              date: inputDate,
              price: inputPrice,
              status: 'requested',
              paid: false,
              notes: '',
              receipt: ''
            }];
            setSessions(updatedSessions);
        } else {
            console.error('Failed to schedule session:', response.statusText);
        }
    } catch (error) {
        console.error('Error scheduling session:', error);
    }
  };

  return (
    <div>
      {student ? (
        <div>
          <div className="bg-red-900 p-4 flex rounded-b-md shadow-md"
          >
            <button
              className={`flex-1 py-2 text-white transition-colors duration-300 ease-in-out mx-5 ${
                selectedSection === 'information' ? 'bg-red-700 font-bold' : 'bg-red-900 hover:bg-red-800'
              }`}
              onClick={() => setSelectedSection('information')}
            >
              Information
            </button>
            <button
              className={`flex-1 py-2 text-white transition-colors duration-300 ease-in-out mx-5 ${
                selectedSection === 'classes' ? 'bg-red-700 font-bold' : 'bg-red-900 hover:bg-red-800'
              }`}
              onClick={() => setSelectedSection('classes')}
            >
              Classes
            </button>
            <button
              className={`flex-1 py-2 text-white transition-colors duration-300 ease-in-out mx-5 ${
                selectedSection === 'payments' ? 'bg-red-700 font-bold' : 'bg-red-900 hover:bg-red-800'
              }`}
              onClick={() => setSelectedSection('payments')}
            >
              Payments
            </button>
          </div>

          {selectedSection === 'information' && (
            <div className="p-4">
              <p className="text-base mb-1">Name: {student.name}</p>
              <p className="text-base mb-1">Course: {student.course}</p>
              <p className="text-base">
                Rate: {student.rate} {student.currency === 'e' ? '€' : student.currency === 's' ? '$' : '(currency not specified)'}/h
              </p>
              <p className="text-base mb-1">
                Meet Link: <a href={student.meetLink} target="_blank" rel="noopener noreferrer">{student.meetLink}</a>
              </p>
              <p className="text-base mb-1">
                Whiteboard Link: <a href={student.whiteboardLink} target="_blank" rel="noopener noreferrer">{student.whiteboardLink}</a>
              </p>
            </div>
          )}
          
          {selectedSection === 'classes' && (
            <div className="p-4">
              
              <form>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`inputDate`}>Date</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={`inputDate`} type="date" placeholder="Date" name="inputDate" value={inputDate} onChange={(e) => setInputDate(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`inputPrice`}>Price</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={`inputPrice`} type="number" placeholder="Price" name="inputPrice" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} required min="0" max="1000" />
                </div>

                <div>
                  <input type="reset" onClick={(e) => {setInputDate(''); setInputPrice('');}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"/>
                </div>

                <div>
                  <input type="submit" onClick={handleRequestSession} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"/>
                </div>

              </form>


              {/* <div className="mb-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  className="border border-gray-300 p-2 rounded-md"
                  placeholderText="Select a date"
                />
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
                >
                  Confirm
                </button>
              </div>

              {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded-md shadow-md">
                    <p>Are you sure you want to confirm this date?</p>
                    <button
                      onClick={handleConfirm}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2 mr-2"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
                    >
                      No
                    </button>
                  </div>
                </div>
              )} */}

              <h3 className="text-lg font-bold mt-4 mb-2">Requested classes</h3>
              <ul>
                {sessions.filter(session => session.status == "requested").map(session => (
                  <li key={session.id}>Date: {session.date} - Price: {session.price}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold mt-4 mb-2">Confirmed classes</h3>
              <ul>
                {sessions.filter(session => session.status == "confirmed").map(session => (
                  <li key={session.id}>Date: {session.date} - Price: {session.price}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold mt-4 mb-2">Done classes</h3>
              <ul>
                {sessions.filter(session => session.status == "done").map(session => (
                  <li key={session.id}>
                    Date: {session.date} - Price: {session.price} -{' '}
                    <a href={session.notes} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      PDF
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Backend and handle functions need to be implemented */}
          {selectedSection === 'payments' && (
            <div className="p-4">
              
              <h3 className="text-lg font-bold mt-4 mb-2">Upcoming classes</h3>
              <ul>
                {sessions.filter(session => session.status !== "done").map(session => (
                  <li key={session.id} className="mb-4">
                    <div>Date: {session.date} - Price: {session.price}</div>
                    {session.receipt === " " ? (
                      <div>
                        <input 
                          type="file" 
                          className="border p-2 mt-2" 
                          onChange={(e) => handleUploadReceipt(e, session.id)}
                        />
                        <button 
                          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                          onClick={() => handleUploadButtonClick(session.id)}
                        >
                          Upload Receipt
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button 
                          className="bg-green-500 text-white py-2 px-4 rounded mt-2 mr-2"
                          onClick={() => handleViewReceipt(session.receipt)}
                        >
                          {session.receipt}
                        </button>
                        {!session.paid && (
                          <button 
                            className="bg-red-500 text-white py-2 px-4 rounded mt-2"
                            onClick={() => handleDeleteReceipt(session.id)}
                          >
                            Delete Receipt
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-bold mt-4 mb-2">Past classes</h3>
              <ul>
                {sessions.filter(session => session.status === "done").map(session => (
                  <li key={session.id} className="mb-4">
                    <div>Date: {session.date} - Price: {session.price}</div>
                    {session.receipt === " " ? (
                      <div>
                        <input 
                          type="file" 
                          className="border p-2 mt-2" 
                          onChange={(e) => handleUploadReceipt(e, session.id)}
                        />
                        <button 
                          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                          onClick={() => handleUploadButtonClick(session.id)}
                        >
                          Upload Receipt
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button 
                          className="bg-green-500 text-white py-2 px-4 rounded mt-2 mr-2"
                          onClick={() => handleViewReceipt(session.receipt)}
                        >
                          {session.receipt}
                        </button>
                        {!session.paid && (
                          <button 
                            className="bg-red-500 text-white py-2 px-4 rounded mt-2"
                            onClick={() => handleDeleteReceipt(session.id)}
                          >
                            Delete Receipt
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-200">
          <div className="border-4 border-gray-300 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>

  );
}

export default StudentPortal;
