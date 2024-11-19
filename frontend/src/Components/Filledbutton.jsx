import '../styles/Filledbutton.css'

export default function Filledbutton(props){
    return(
        <button className='Button-filled'>
            <p>{props.text}</p>
        </button>
    )
}