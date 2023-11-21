import React from 'react'
import Projects from '../../components/Projects/index'

const ProjectsContainer = () => {
 
  const data = [
    {
      name: "RecipeHub",
      description: "MERN based Recipe Manager",
      link: "https://nextjs-mern-recipehub.vercel.app",
    },
    {
      name: "Crypto tracker",
      description: "One stop to all your crypto tracking",
      link: "https://react-crypto-track.vercel.app/",
    },

    {
      name: "ShopNow",
      description:
        "An e-commerce app which is built using React where Redux is used for state management",
      link: "https://react-shop-now.netlify.app",
    },

    {
      name: "Movie-Info",
      description:
        "A movie Info App  which is built using React Get movies details based on user search.",
      link: "https://react-movie-info-v-01.netlify.app",
    },

    {
      name: "NoteBook",
      description: "MERN based Notebook Manager",

      link: "https://mern-notebook-manage.netlify.app",
    },

    {
      name: "News App",
      description:
        "A realtime news app built in React that displays top realtime news along with categories that user can choose from",
      link: "https://react-news-app-realtime.netlify.app",
    },
    {
      name: "Expense",
      description: "Expense tracker app fueled by React.JS",
      link: "https://react-expense-tracker-v-1-0.netlify.app",
    },
  ];

  return <Projects data={data} />
}

export default ProjectsContainer
