const Profile = ({ user, isAuthenticated, isLoading }) => {

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <h2>{user.sub}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;