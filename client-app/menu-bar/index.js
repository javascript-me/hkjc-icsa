import React, {Component} from 'react';
import { Link } from 'react-router';
import menuBarData from './menuBarData.js';

class MenuBar extends Component {
    render() {
        return (
            <div className="menu-bar-wrap row">
                <div style={{lineHeight:'35px',backgroundColor:'#f3f3f3'}}>systemBar</div>
                <div className="menu-container">
                   <div className="events">EVENTS</div>
                   <div className="menu-box">
                    {menuBarData.length > 0 && menuBarData.map((item,idx) => (
                    <div className="menu-unit" key={idx}>
                        <Link to={item.link} className="level-1-unit">
                            <img className="icon" src={'menu-bar/'+item.iconSrc}/>
                            <div className="text">
                                <div>{item.textL1}</div>
                                <div>{item.textL2}</div>
                            </div>
                           
                        </Link>
                        
                        <SecondLevelMenu dataList={item.subMenu}/>
                    </div>
                ))}
                </div>
                <div className="toggle-btn">c</div>
                <div className="message">Message</div>
                </div>
                
            </div>
        );
    }
}

const ThirdLevelMenu = (props) => {
    let { data } = props;
    let thirdLevelOnly = true;
    if(data) {
        for(let child of data){
            child.subMenu && (thirdLevelOnly = false);
        }
    }
    if(!thirdLevelOnly){
        return (
        <div className="third-level">
            <div className="third-level-container">
                { data && data.map( (item,idx) => (
            <div className="third-level-item" key={idx}>
            <Link to={item.link} className="text">
                 {item.text}
            </Link>
            <div className="underline">h</div>
            <div className="forth-level-container">
                {item.subMenu && item.subMenu.map((item,idx) => (
                    <Link key={idx} to={item.link} className="forth-level-item">{item.text}</Link>
                )) }
            </div>
           </div>
        ))}
            </div>
        
        </div>
    )
    }
    return(<div></div>)
    
}

const ThirdLevelOnly = (props) => {
    let thirdLevelOnly = true;
    if(props.data) {
        for(let child of props.data){
            child.subMenu && (thirdLevelOnly = false);
        }
    }
    if(thirdLevelOnly){
        return (<div className="third-level-only">
            <div className="third-level-only-container">
                {props.data && props.data.map((item,idx) => (
                    <Link className="third-only-item" key={item.text}>{item.text}</Link>
                ))}
            </div>
        </div>)
    }
    return (<div></div>)
}

const SecondLevelMenu = (props) => {
    let { dataList } = props;
    return (
        <div className="second-level">
            <div className="second-level-container">
            {dataList && dataList.map((item,idx) => (<div key={idx} className="second-level-item">
            <div  className="second-level-text">
                <Link to={item.link}>{item.text}</Link>
                <ThirdLevelOnly data={item.subMenu} />
            </div>
            
            <ThirdLevelMenu data={item.subMenu} />
            </div>))}
            </div>
        </div>
    )
}


export default MenuBar;