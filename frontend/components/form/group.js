import styles from '../../styles/CreateGroup.module.css'

export default function Group({ GroupForm }) {



  return (
    <div className={styles.contentFormGroup}>
      <div className={styles.groupHeader}>
        <h1>Create group</h1>
        <i className="fa-regular fa-circle-xmark close-form-group-btn" onClick={GroupForm} title="Close form"></i>
      </div>
      <hr />
      <form action="">
        <div className={styles.groupContent}>
          <input type="text" className={styles.titleGroup} placeholder="Title of the group" />
          <select className={styles.selectInput} name="" id="">
            <option value="">Choose privacy</option>
            <option value="">Public</option>
            <option value="">Private</option>
          </select>
          <textarea name="" placeholder="Decription of the group" id="" ></textarea>
        </div>
        <ListFriend />
        <button className={styles.btnGroup}>Create</button>

      </form>
    </div>
  );
}


export function ListFriend() {
  const data = [
    {
      name: "alice doe",
      image: "person1.jpg"
    },
    {
      name: "michel doe",
      image: "person2.jpg"
    },
    {
      name: "jack doe",
      image: "person3.jpg"
    },
    {
      name: "christin doe",
      image: "person4.jpg"
    }
  ];
  return (
    <div className={styles.listFriend}>
      <h3> <span>select friends</span></h3>
      {data.map((item, index) => (

        <div className={styles.userBloc} key={index}>
          <div>
            <img src={"" + item.image} alt="" />
            <span>{item.name}</span>
          </div>
          <input type="checkbox" name="" id="" />
        </div>

      ))
      }
    </div>
  )
}