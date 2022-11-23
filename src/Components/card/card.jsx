import './card.css';
import javaimg from '../../java.png';


export const Card = ({ skill }) => {

    const { id, name } = skill;
    
    return(
        <div className='card-container' key={id}>
            <div>
                <img src={javaimg} alt="Lamp" width="32" height="50"/>
                <h2>{name}</h2>
            </div>
        </div>
    );
}