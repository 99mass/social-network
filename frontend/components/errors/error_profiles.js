export function ErrorProfile() {
  return (
    <div className="pemission-bloc">
      <img src="../images/permissions_dark_mode.svg" alt="" />
      <h3>This content isn't available right now</h3>
      <p>
        When this happens, it's usually because the owner only shared it with a
        small group of people, changed who can see it or it's been deleted.
      </p>
    </div>
  );
}

export function ErrorComment() {
  return (
    <div className="pemission-bloc">
      <img src="../images/permissions_dark_mode.svg" alt="" />
      <h3>This content isn't available right now</h3>
      <p>
        When this happens, it's usually because the post doesn't exist.
      </p>
    </div>
  );
}
