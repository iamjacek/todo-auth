import React, { useState } from "react"
import { Box, Container, Typography, Card, Chip } from '@material-ui/core'
import Logo from "../components/Logo"
import Icon from '@material-ui/core/Icon';

//add styling using JSS object
import { styled } from '@material-ui/core/styles'

import { useQuery, gql } from '@apollo/client';

const LIST_DATA = gql`
  query{
    lists{
      users_permissions_user{
        _id
      }
      _id
      name
      description
      items{
        itemName
        itemDescription
        _id
      }
    }
  }
`;

const CenterContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
})

const Wrapper = styled(Box)({
display: 'flex',

})

const CardWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: "wrap",
  justifyContent: "center"
})

const CardList = styled(Card)({
  width: '200px',
  margin: '0.5rem',
  padding: '0.5rem 1rem',
})

const handleDelete = () => {
  console.info('You clicked the delete icon.');
};



const Lists = () => {
  const { loading, error, data } = useQuery(LIST_DATA);

  const handleClick = (e) => {
    e.currentTarget.classList.toggle("item__clicked")
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  const userID = JSON.parse(localStorage.getItem("userID"))
  return  (
    <Wrapper>
      <CenterContainer>
          <div>
            <Logo />
          </div>
          
          <Typography variant="h3" component="h1" align="center" >
            Your Lists!
          </Typography>

          <Typography variant="subtitle1" align="center" paragraph={true} >
            Simply choose one of your lists or create new
          </Typography>
          <CardWrapper>
            <CardList elevation={3} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              <h2 style={{marginBottom: "0.2rem"}}>Create new list</h2>
              <Icon style={{ fontSize: 50 }}>add_circle</Icon>
            </CardList>

            {data.lists.map(({_id, name, description, items, users_permissions_user}) => (
              (users_permissions_user._id === userID) && (
                  <CardList elevation={3} key={_id}>
                    <h2 style={{marginBottom: "0.2rem"}}>{name}</h2>
                    <p style={{marginBottom: "1rem", color:"gray"}}>{description}</p>
                    {items.map(item => 
                    <div key={item._id}  style={{margin: "0.5rem 0", display: "block"}}>
                      <Chip 
                        label={item.itemName} 
                        onClick={handleClick} 
                        onDelete={handleDelete}
                        color="primary"
                        variant="outlined"
                      />
                    </div>
                    )}
                    
                  </CardList>
              )
            ))}
          </CardWrapper>
          
         
      </CenterContainer>
    </Wrapper>
  )
}

export default Lists






// export default function Chips() {
//   const classes = useStyles();

//   const handleDelete = () => {
//     console.info('You clicked the delete icon.');
//   };

//   const handleClick = () => {
//     console.info('You clicked the Chip.');
//   };

//   return (
//     <div className={classes.root}>
//       <Chip label="Basic" />
//       <Chip label="Disabled" disabled />
//       <Chip avatar={<Avatar>M</Avatar>} label="Clickable" onClick={handleClick} />
//       <Chip
//         avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
//         label="Deletable"
//         onDelete={handleDelete}
//       />
//       <Chip
//         icon={<FaceIcon />}
//         label="Clickable deletable"
//         onClick={handleClick}
//         onDelete={handleDelete}
//       />
//       <Chip
//         label="Custom delete icon"
//         onClick={handleClick}
//         onDelete={handleDelete}
//         deleteIcon={<DoneIcon />}
//       />
//       <Chip label="Clickable Link" component="a" href="#chip" clickable />
//       <Chip
//         avatar={<Avatar>M</Avatar>}
//         label="Primary clickable"
//         clickable
//         color="primary"
//         onDelete={handleDelete}
//         deleteIcon={<DoneIcon />}
//       />
     
//       <Chip label="Deletable primary" onDelete={handleDelete} color="primary" />
//       <Chip
//         icon={<FaceIcon />}
//         label="Deletable secondary"
//         onDelete={handleDelete}
//         color="secondary"
//       />
//     </div>
//   );
// }
