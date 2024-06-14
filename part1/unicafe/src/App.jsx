import { useState } from 'react'
const Button=(props)=>{
  return(
   
      <button onClick={props.handleClick}>{props.text}</button>
   
  )
}

const StastisticLine=(props)=>{
  return(
    <div>
      <table >
        <tbody>
          <tr>
            <td>{props.text}</td>
            <td> {props.value}</td>
          </tr>
        </tbody>
      </table>
      
    </div>
  )
}
const Statistics=(props)=>{
  const total = props.good + props.neutral + props.bad;
  if(total!=0){
    return(
      <div>
       <StastisticLine text="good" value={props.good}/>
       <StastisticLine text="neutral" value={props.neutral}/>
       <StastisticLine text="bad" value={props.bad}/>
       <StastisticLine text="All" value={total}/>
       <StastisticLine text="Average" value={((props.good-props.bad)/(total))||0}/>
       <StastisticLine text="Positive" value={(props.good/total)||0}/>
       
      </div>
    )
  }
  else{
    return(
      <div><h3>No feedback given</h3></div>
    )
  }
  
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

 const handleClickGood=()=>{
    setGood(good+1);
 }
 const handleClickNeutral=()=>{
  setNeutral(neutral+1);
}
const handleClickBad=()=>{
  setBad(bad+1);
}
  return (
    <div>
      <h1>Give Feedback</h1>
      
      <Button handleClick={handleClickGood} text="good"/>
     
      <Button handleClick={handleClickNeutral} text="neutral"/>
      
      <Button handleClick={handleClickBad} text="bad"/>
      <h1>Stastitics</h1>
      <Statistics good={good} bad={bad} neutral={neutral}/>
      
    </div>
    
  )
}

export default App