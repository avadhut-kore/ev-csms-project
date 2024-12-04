// pages/redirectPage.js

export async function getServerSideProps() {
    return {
      redirect: {
        destination: '/login',  // The URL to redirect to
        permanent: false,       // Set to `true` for a 308 permanent redirect
      },
    };
  }
  
  export default function RedirectPage() {
    return null;  // This page doesn't render anything because it's redirected
  }
  