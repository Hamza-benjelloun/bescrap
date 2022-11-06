import React from 'react'
import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'
import { mobile } from '../Reponsitivity'

const Container = styled.div`
    width: 60%;
    display: flex;
    margin: 0px auto;
    ${mobile({width : "100%"})};


`
const SocialWrapper = styled.div`
        flex: 1;
        background-color: white;
        border : 1px #ccc solid;

      
`
const MatchWrapper = styled.div`

    flex: 2;
    background-color: white;
    



`
const Layout = (props) => {
  return (
    <div>
      <Header/>
      <Container>
        <SocialWrapper>

        </SocialWrapper>
        <MatchWrapper>
        {props.children}
        </MatchWrapper>
      </Container>
  
      <Footer />
    </div>
  )
}

export default Layout
