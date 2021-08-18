export const Authentication = ({
  isLogIn,
}) => {

	return (
    <form>
      {`${isLogIn}`}
      {isLogIn ?
        <>
          <label>
            Username:
            <input type="text" />
          </label>
          <label>
            Password:
            <input type="password" />
          </label>
          <label>
            <input type="checkbox" />
            Stay signed in
          </label>
        </>
      :
        <>
        <label>
            Username:
            <input type="text" />
          </label>
          <label>
            Email:
            <input type="email" />
          </label>
          <label>
            Password:
            <input type="password" />
          </label>
        </>
      }
    </form>
	)
}