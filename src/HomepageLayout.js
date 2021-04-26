
/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component, useEffect, useState } from 'react'
import axios from 'axios';
import {
  Message,
  Button,
  Checkbox,
  Form,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ data, mobile }) => (
  <Container text>
    <Header
      as='h1'
      content={data.Header_Titre}
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content={data['Header_Sous-titre']}
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
{/*  <Button primary size='huge'>
    Get Started
    <Icon name='right arrow' />
  </Button>*/}
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
  data: PropTypes.object
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {

  constructor(props) {
    super(props);
  }
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Media greaterThan='mobile'>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >
{/*          <Menu
            fixed={fixed ? 'top' : null}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            size='large'
          >
            <Container>
              <Menu.Item as='a' active>
                Home
              </Menu.Item>
              <Menu.Item as='a'>Work</Menu.Item>
              <Menu.Item as='a'>Company</Menu.Item>
              <Menu.Item as='a'>Careers</Menu.Item>
              <Menu.Item position='right'>
                <Button as='a' inverted={!fixed}>
                  Log in
                </Button>
                <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                  Sign Up
                </Button>
              </Menu.Item>
            </Container>
          </Menu>*/}
            <HomepageHeading data={this.props.data}/>
          </Segment>
        </Visibility>

        {children}
      </Media>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  constructor(props) {
    super(props);
  }  
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as='a' active>
              Home
            </Menu.Item>
            <Menu.Item as='a'>Work</Menu.Item>
            <Menu.Item as='a'>Company</Menu.Item>
            <Menu.Item as='a'>Careers</Menu.Item>
            <Menu.Item as='a'>Log in</Menu.Item>
            <Menu.Item as='a'>Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 350, padding: '1em 0em' }}
              vertical
            >
{/*              <Container>
                <Menu inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item position='right'>
                    <Button as='a' inverted>
                      Log in
                    </Button>
                    <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>*/}
              <HomepageHeading mobile data={this.props.data}/>
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children, data }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer data={data}>{children}</DesktopContainer>
    <MobileContainer data={data}>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

//

const HomepageLayout = () => {
  let [ data, setData ] = useState(null);  
  let [ file, setFile ] = useState(null);  
  let [ hideFormSuccess, setHideFormSuccess] = useState(true);
  let [ userInput, setUserInput ] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (event, data) => {
    let URL = '/api/submit';
    let formData = new FormData();
    let payload = { ... userInput };
    // console.log(file);
    // return;
    formData.append('file', file);
    formData.append('email', payload.email);
    formData.append('subject', payload.subject);
    formData.append('message', payload.message);    

    axios.post(URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(resp => {
      setHideFormSuccess(false)
    })
    .catch(e => console.error(e));    
  }
  const  handleChange = (e, {name, value}) => {        
    setUserInput(Object.assign(userInput, { [name]: value }))
  }

  const fileEvent = (e) => {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    let URL = '/api';
    axios.get(URL)
    .then(resp => {
      setData(resp.data);            
    })
    .catch(e => console.error(e));
  }, []);  


  return (
    <React.Fragment>
    {
      data &&
      <ResponsiveContainer data={data.header}>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  {data.block.Block_titre_1}
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  {data.block.Block_paragraphe_1}
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  {data.block.Block_titre_2}
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  {data.block.Block_paragraphe_2}
                </p>
              </Grid.Column>
              <Grid.Column floated='right' width={6}>
                <Image bordered rounded size='large' src={data.block.Block_image_1} />
                <Image bordered rounded size='large' src={data.block.Block_image_2} />
              </Grid.Column>          
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  {data.comment.Comment_titre}
                </Header>
                <p style={{ fontSize: '1.33em' }}>{data.comment['Comment_sous-titre']}</p>
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  {data.comment.Comment_user}
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  <Image avatar src={data.comment.Comment_user_avatar} />
                  {data.comment.Comment_user_position}
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container text>
            <Header as='h3' style={{ fontSize: '2em' }}>
              {data.formation.Formation_titre_1}
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              {data.formation.Formation_texte_1}
            </p>
            <Button as='a' size='large'>
              {data.formation.Formation_cta_1}
            </Button>

            <Divider
              as='h4'
              className='header'
              horizontal
              style={{ margin: '3em 0em', textTransform: 'uppercase' }}
            >
              <a href='#'>Nos formations</a>
            </Divider>

            <Header as='h3' style={{ fontSize: '2em' }}>
              {data.formation.Formation_titre_2}
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              {data.formation.Formation_texte_2}
            </p>
            <Button as='a' size='large'>
              {data.formation.Formation_cta_2}
            </Button>
          </Container>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='Numericoach' />
                  <List link inverted>
                    <List.Item as='a'>Formation</List.Item>
                    <List.Item as='a'>Services</List.Item>
                    <List.Item as='a'>Modalites</List.Item>
                    <List.Item as='a'>Financements</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='A propos' />
                  <List link inverted>
                    <List.Item as='a'>Nos experts Google</List.Item>
                    <List.Item as='a'>Ils nous font confiance</List.Item>
                    <List.Item as='a'>CGV</List.Item>
                    <List.Item as='a'>Politique de protections de données</List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>

        <Segment inverted vertical>
          <Container>        
            <Header as='h3' style={{ fontSize: '2em' }} inverted>
              Contactez-nous
            </Header>
            <Message
              success
              hidden={hideFormSuccess}
              header='Top!'
              content="Merci pour votre message"
            />               
            <Form onSubmit={handleSubmit} autocomplete="off">
              <Form.Field>
                <label style={{ color: 'white'}}>Email</label>
                <Form.Input placeholder='Email' name="email" onChange={handleChange}/>
              </Form.Field>
              <Form.Field>
                <label style={{ color: 'white'}}>Objet</label>
                <Form.Input placeholder='Objet' name="subject" onChange={handleChange}  />
              </Form.Field>
              <Form.Field>
                <label style={{ color: 'white'}}>Message</label>
                <Form.TextArea label='Message' placeholder='Votre message...'  name="message" onChange={handleChange}  />
              </Form.Field>
              <Form.Field>
                <label style={{ color: 'white'}}>Document</label>
                <Form.Input type="file"  name="message" onChange={fileEvent}  />
              </Form.Field>              
              <Button type='submit'>Envoyer</Button>
            </Form>            
          </Container>
        </Segment>
      </ResponsiveContainer>
    }
  </React.Fragment>
  )
}

export default HomepageLayout