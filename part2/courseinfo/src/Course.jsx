const Somme = (props) => {
  
    const totalExercises = props.parts.reduce((sum, part) => sum + part.exercises, 0);
    
    return (
      <div>
        Total exercises: {totalExercises}
      </div>
    );
  };
  
  const Course = ({ course }) => {
    return (
      <div>
        <h2>{course.name}</h2>
        {course.parts.map(part => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
        <Somme parts={course.parts} />
      </div>
    );
  };
export default Course  