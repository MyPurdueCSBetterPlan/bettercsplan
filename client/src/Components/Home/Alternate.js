function Alternate(props) {
    return (
        <p onClick={() => props.handleClick(props.name, props.credits)}>{props.name}</p>
    )
}

export default Alternate