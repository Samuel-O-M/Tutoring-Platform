import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading'

const TutorPortal = () => {
  const { tutorId } = useParams();
  const [students, setStudents] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/students/all');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-4 gap-4 mt-8">
        <h2 className="text-2xl font-semibold col-span-4 mb-16">Current ID is: {tutorId}</h2>
        {students ? (
          students.map(student => (
            // <Link key={student._id} to={`/tutor/${tutorId}/student/${student._id}`}>
            <Link key={student._id} to={`/student/${student._id}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-48 h-24">
                <div>
                  <p className="text-lg font-semibold">{student.name}</p>
                  <p className="text-sm font-normal text-gray-300">{student.course}</p>
                </div>
              </button>
            </Link>
          ))
        ) : (
          <Loading/>
        )}
      </div>
    </div>
  );
};

export default TutorPortal;
