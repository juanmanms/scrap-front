import PropTypes from 'prop-types'

interface TablaResultProps {
    data: object;
    config: object;
}

const TablaResult = ({ data, config }: TablaResultProps) => {
    console.log('data', data)
    console.log('config', config)
    return (
        <div>TablaResult</div>
    )
}

TablaResult.propTypes = {
    data: PropTypes.object

}

export default TablaResult
