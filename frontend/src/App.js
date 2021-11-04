import logo from './twitter.svg'
import './App.css'
import { FaCrosshairs } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input,InputGroup,InputRightElement,Box } from "@chakra-ui/react"

function App() {
  const [trends, setTrends] = useState([])
  const [woeid, setWoeid] = useState('1')
  const [users, setUsers] = useState([])
  const [hashtags, setHashtags] = useState([])
  const [searchValue, setSearchValue] = useState('life')
  const [searchHashtag, setSearchHashtag] = useState('live')
  useEffect(() => {getTrends(); getMensions(); getHashtags(); },[woeid])

  function getTrends() {
    axios
      .get('/api/trends', {
        params: {
          woeid,
        },
      })
      .then(response => {
        console.log(response.data)
        setTrends(response.data[0].trends)
      })
      .catch(error => console.log(error.message))
  }

  function getMensions() {  
    axios
      .get('/api/mentions', { 
        params: {
          searchValue,
        },
       })
      .then(response => {
        console.log(response.data)
        setUsers(response.data)
      })
      .catch(error => console.log(error.message))
  }

  function getHashtags() {  
    axios
      .get('/api/hashtags', { 
        params: {
          searchHashtag,
        },
       })
      .then(response => {
        console.log(response.data)
        setHashtags(response.data.statuses)
      })
      .catch(error => console.log(error.message))
  }

  function handleLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          axios
            .get('/api/near-me', {
              params: {
                lat: position.coords.latitude,
                long: position.coords.longitude,
              },
            })
            .then(response => {
              console.log(response.data[0].woeid)
              setWoeid(response.data[0].woeid)
            })
            .catch(error => console.log(error.message))
        },
        error => {
          console.log(error.message)
        }
      )
    } else {
      alert(`Geolocation not supported`)
    }
  }

  function listTrends() {
    return (
      <ul>
        {trends.map((trend, index) => {
          return (
            <li key={index}>
              <a href={trend.url}>{trend.name}</a>
              {trend.tweet_volume && (
                <span className='tweet_volume'>{trend.tweet_volume}</span>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  function listUsers() {
    return (
      <ul>
        {users.map((user, index) => {
          return (
            <li key={index}>
              <a href={user.url}>{user.name}</a>
              {user.location && (
                <span className='tweet_volume'>{user.location}</span>
              )}
            </li>
          )
        })}
      </ul>
    )
  }
  function listHashtags() {
    return (
      <ul>
        {hashtags.map((user, index) => {
          return (
            <li key={index}>
              <a href={user.source}>{user.text}</a>
              {/* {user.location && (
                <span className='tweet_volume'>{user.location}</span>
              )} */}
            </li>
          )
        })}
      </ul>
    )
  }

  const handleChangeUsers= (e) => {
    setSearchValue(e.target.value)
    console.log(searchValue);
  }
  const handleChangeHashtags= (e) => {
    setSearchHashtag(e.target.value)
    console.log(searchHashtag);
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='logo' alt='twitter' />
        <h3>Twitter Trends</h3>
      </header>
      <div className='menu'>
        <select name='trending-place' onChange={e => setWoeid(e.target.value)}>
          <option value='1'>Worldwide</option>
          <option value='23424848'>India</option>
          <option value='2459115'>New York,US</option>
          <option value='2442047'>Los Angeles,US</option>
          <option value='2295411'>Mumbai</option>
          <option value='1105779'>Sydney,AU</option> 
          <option value='2343732'>Ankara,TR</option>
          <option value='2344116'>Istanbul,TR</option>
        </select>
        <div className='location' onClick={handleLocation}>
          <FaCrosshairs />
        </div>
      </div>
      <div className='content'>{listTrends()}</div>
      <header className='App-header'>
        <img src={logo} className='logo' alt='twitter' />
        <h3>Twitter Users</h3>
      </header>
      <div className='menu'>
          <InputGroup size="md">
              <Input
                pr="4.5rem"
                onChange={handleChangeUsers}
                placeholder="Search Users "
              />
          <InputRightElement width="4.5rem">
            <Box as="button" borderRadius="md" bg="tomato" color="white" 
            value={searchValue} onClick={getMensions} alignItems="baseline" px={4} h={40}>
                Search
            </Box>
          </InputRightElement>
        </InputGroup>
      </div>
      <div className='content'>{listUsers()}</div>
      
      <header className='App-header'>
        <img src={logo} className='logo' alt='twitter' />
        <h3>Twitter Hashtags</h3>
      </header>
      <div className='menu'>
          <InputGroup size="md">
              <Input
                pr="4.5rem"
                onChange={handleChangeHashtags}
                placeholder="Search Hashtags "
              />
          <InputRightElement width="4.5rem">
              <Box as="button" borderRadius="md" bg="tomato" color="white" value={searchHashtag} onClick={getHashtags} px={4} h={40}>
                 Search
              </Box>
          </InputRightElement>
        </InputGroup>
      </div>
      <div className='content'>{listHashtags()}</div>
    </div>
  )
}

export default App
