import styles from '../../styles/modules/CreateGroup.module.css'

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
      image: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY="
    },
    {
      name: "michel doe",
      image: "https://media.istockphoto.com/id/1413765605/fr/photo/portrait-dune-femme-daffaires-afro-am%C3%A9ricaine-prosp%C3%A8re.webp?b=1&s=170667a&w=0&k=20&c=T8Aiogu4Y9EnlE3sNKP_L6H5sHrYv4ttFMfzNgcUmwI="
    },
    {
      name: "jack doe",
      image: "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o="
    },
    {
      name: "christin doe",
      image: "https://media.istockphoto.com/id/1511315040/fr/photo/souriez-tablette-et-recherchez-avec-une-femme-noire-au-bureau-pour-la-technologie.webp?b=1&s=170667a&w=0&k=20&c=D9yNSpTwRSf2Iw2xeOxFKnSxqD2xijYXsU4B6vxt-ys="
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