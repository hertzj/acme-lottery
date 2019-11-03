/* eslint-disable complexity */
const { Component } = React;
const { HashRouter, Route, Link, Switch, Redirect } = ReactRouterDOM;
const root = document.querySelector('#root');

const Nav = ({ location }) => {
    const { pathname } = location;
    console.log(pathname);
    return (
        <nav>
            <Link className={ pathname === '/' ? 'header selected' : 'header' } to='/'>Home</Link>
            <Link className={ pathname === '/games/powerball' ? 'header selected' : 'header' } to='/games/powerball'>Powerball</Link>
            <Link className={ pathname === '/games/megamillions' ? 'header selected' : 'header' } to='/games/megamillions'>Mega Millions</Link>
            <Link className={ pathname === '/games/takefive' ? 'header selected' : 'header' } to='/games/takefive'>Take Five</Link>
        </nav>
    )

}

class App extends Component {
    constructor() {
        super();
        this.state = {
            powerball: [],
            mega: [],
            take: [],
        }
    }

    generateNum = (n) => {
        return Math.ceil(Math.random() * n);
    }

    generatePower = () => {
        let powerball = [];
        for (let i = 0; i < 4; i++) {
            let num = this.generateNum(69)
            powerball.push(num);
        }
        let num = this.generateNum(26);
        powerball.push(num);
        this.setState({ powerball })
        return powerball
    }

    generateMega = () => {
       let mega = [];
       for (let i = 0; i < 4; i++) {
           let num = this.generateNum(70);
           mega.push(num);
       }
       let num = this.generateNum(25);
       mega.push(num);
       this.setState({ mega })
       return mega
    }

    generateTake = () => {
        let take = [];
        for (let i = 0; i < 5; i++) {
            let num = this.generateNum(39);
            take.push(num);
        }
        this.setState({ take })
        return take
    }

    update = (mega, powerball, take) => {
        this.setState({mega, powerball, take})
    }

    render() {
        const { take, powerball, mega } = this.state;
        const { update } = this
        const { generateMega, generateTake, generatePower } = this;
        console.log('take: ', take);
        console.log('powerball: ', powerball);
        console.log('mega: ', mega);
        return (
            <HashRouter>
                <Route render={(props) => <Nav { ...props } /> } />
                <Route exact path='/' render={ (props) => <Home {...props} generatePower = {generatePower} generateTake = {generateTake} generateMega = {generateMega} update={update}/> } />
                <Route exact path='/games/powerball' render={ () => <PowerBall  powerball={powerball} /> }/>
                <Route exact path='/games/megamillions' render={ () => <MegaMillions  mega={mega} /> }/>
                <Route exact path='/games/takefive' render={ () => <TakeFive  take={take} /> }/>
            </HashRouter>
        )
    }
}

const PowerBall = ({ powerball }) => {
    return (
        <div className='results'>
            <h1>Acme Lottery</h1>
            <div className='bigbox'>
                <h3>Powerball</h3>
                <h6>Winning Numbers:</h6>
                <div className='boxes'>
                    {powerball.map((num, idx) => {
                        if (idx < 4) {
                            return <div key={idx} className='box'>{num}</div>
                        }
                        else {
                            return <div key={idx} className='box special'>{num}</div>
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

const MegaMillions = ({ mega }) => {
    return (
        <div className='results'>
            <h1>Acme Lottery</h1>
            <div className='bigbox'>
                <h3>Mega Millions</h3>
                <h6>Winning Numbers:</h6>
                <div className='boxes'>
                    {mega.map((num, idx) => {
                        if (idx < 4) {
                            return <div key={idx} className='box'>{num}</div>
                        }
                        else {
                            return <div key={idx} className='box special'>{num}</div>
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

const TakeFive = ({ take }) => {
    return (
        <div className='results'>
            <h1>Acme Lottery</h1>
            <div className='bigbox'>
                <h3>Mega Millions</h3>
                <h6>Winning Numbers:</h6>
                <div className='boxes'>
                    {take.map((num, idx) => <div key={idx} className='box'>{num}</div>)}
                </div>
            </div>
        </div>
    )
}

// eslint-disable-next-line react/no-multi-comp
class Home extends Component {
    constructor({ generateMega, generatePower, generateTake, update }) {
        super();
        this.state = {
            game: 'powerball',
            take: [],
            powerball: [],
            mega: [],
            generateMega,
            generatePower,
            generateTake,
            update,
            values: {
                1: null,
                2: null,
                3: null,
                4: null,
                5: null
            },
            matches: 0,
            specialMatch: 0,
            checked: false,
        }
    }

    componentDidMount() {
        const mega = this.state.generateMega();
        const powerball = this.state.generatePower();
        const take = this.state.generateTake();
        this.setState({ mega, powerball, take })
        this.state.update(mega, powerball, take)
    }

    changeGame = () => {
        const game = document.querySelector('select').value
        this.setState({ game })
    }

    powerBallCheck = () => {
        let matches = 0;
        let specialMatch = 0;
        const { values } = this.state;
        const given = Object.values(values);
        const { powerball } = this.state
        for (let i = 0; i < powerball.length; i++) {
            let num = powerball[i];
            
            if (i === powerball.length - 1 && given.indexOf(num) === powerball.length - 1) {
                specialMatch++;
            }
            else if (given.indexOf(num) > -1) {
                matches++
            }
        }
        this.setState({matches, specialMatch})
    }

    megaCheck = () => {
        let matches = 0;
        let specialMatch = 0;
        const { values } = this.state;
        const given = Object.values(values);
        const { mega } = this.state
        for (let i = 0; i < mega.length; i++) {
            let num = mega[i];
            
            if (i === mega.length - 1 && given.indexOf(num) === mega.length - 1) {
                specialMatch++;
            }
            else if (given.indexOf(num) > -1) {
                matches++
            }
        }
        this.setState({matches, specialMatch})
    }

    takeFiveCheck = () => {
        let matches = 0;
        const { values } = this.state
        console.log(values)
        const given = Object.values(values);
        console.log(given)
        const { take } = this.state;
        for (let i = 0; i < take.length; i++) {
            let num = take[i];
            if (given.indexOf(num) > -1) {
                matches++
            }
        }
        console.log(given)
        this.setState({matches})
    }

    // eslint-disable-next-line complexity
    // eslint-disable-next-line max-statements
    // eslint-disable-next-line complexity
    // eslint-disable-next-line max-statements
    onClick = (ev) => {
        ev.preventDefault();
        this.setState({checked: true});

        const { game } = this.state;
        const { values } = this.state
        const given = Object.values(values);
        let matches = 0;
        let specialMatch = 0;
        if (game === 'powerball') {
            const { powerball } = this.state
            for (let i = 0; i < powerball.length; i++) {
                let num = powerball[i];
                if (i === powerball.length - 1 && given.indexOf(num) === powerball.length - 1) {
                    specialMatch++;
                }
                else if (given.indexOf(num) > -1) {
                    matches++
                }
            }
        }
        else if (game === 'megamillions') {
            const { mega } = this.state
            for (let i = 0; i < mega.length; i++) {
                let num = mega[i];
                if (i === mega.length - 1 && given.indexOf(num) === mega.length - 1) {
                    specialMatch++;
                }
                else if (given.indexOf(num) > -1) {
                    matches++
                }
            }
        }
        else if (game === 'takefive') {
            const { take } = this.state
            for (let i = 0; i < take.length; i++) {
                let num = take[i];
                if (given.indexOf(num) > -1) {
                    matches++
                }
            }
        }

        this.setState({matches, specialMatch})
    }


    handleChange = ev => {
        if (ev.target.value.length > 2) {
            ev.target.value = ''
        }
        
        const newValue = Number(ev.target.value);
        const name = ev.target.name;
        const { values } = this.state;
        values[name] = newValue;
        this.setState({values})

    }


    // eslint-disable-next-line complexity
    render() {
        const {changeGame, onClick} = this;
        const { game, checked, matches, specialMatch } = this.state
        return (
            <div id='home'>
                <h1>Acme Lottery</h1>
                <form action="">
                { game === 'powerball' || game === 'megamillions' ? 
                            <div id='boxes'>
                                <input name='1' type='text' className='box' onChange = {this.handleChange} />
                                <input name='2' type='text' className='box' onChange = {this.handleChange} />
                                <input name='3' type='text' className='box' onChange = {this.handleChange} />
                                <input name='4' type='text' className='box' onChange = {this.handleChange} />
                                <input name='5' type='text' className='box special' onChange = {this.handleChange} />
                            </div>
                            : 
                            <div id='boxes'>
                                <input name='1' type='text' className='box' onChange = {this.handleChange}/>
                                <input name='2' type='text' className='box' onChange = {this.handleChange}/>
                                <input name='3' type='text' className='box' onChange = {this.handleChange}/>
                                <input name='4' type='text' className='box' onChange = {this.handleChange}/>
                                <input name='5' type='text' className='box' onChange = {this.handleChange}/>
                            </div>
                            }
                    <span>Game: </span>
                    <select onChange = {changeGame} name="typeGame">
                        <option value="powerball">Powerball</option>
                        <option value="megamillions">Mega Millions</option>
                        <option value="takefive">Take Five</option>
                    </select>
                    <button onClick = {onClick}>Check My Numbers!!</button>
                </form>
                {
                    checked && game === 'powerball' ? <p>You got {matches} regular matches! You got {specialMatch} special matches!</p> : ''
                }
                {
                    checked && game === 'megamillions' ? <p>You got {matches} regular matches! You got {specialMatch} special matches!</p> : ''
                }
                {
                    checked && game === 'takefive' ? <p>You got {matches} regular matches!</p> : ''
                }
                <div id='rules'>
                    <h6>Rules</h6>
                    <p>Powerball has 5 balls that range from 1-69 and 1 ball that ranges from 1-26</p>
                    <p>Mega Millions has 5 balls that range from 1-70 and 1 ball that ranges from 1-25</p>
                    <p>Take Five has 5 balls that range from 1-39</p>
                </div>
            </div>
        )
    }
}




ReactDOM.render(<App />, root)