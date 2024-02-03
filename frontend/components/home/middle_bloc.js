import Link from "next/link";

export default function MidlleBloc() {
    const data=[
        {
            user: "Lions M ",
            text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
            imageUrl:"https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            date:"16m"
        },
        {
            user: "Lions D ",
            text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
            imageUrl:"https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
            date:"16h"
        }
    ]

    return(
        <div className="menu-middle">
        { data.map((item,index)=>(
                <div className="post post1" key={index}>
                    <PostHeader user={item.user} image={item.imageUrl} time={item.date}  />
                    <PostMiddle text={item.text}  image={item.imageUrl} />
                    <PostFooter />
                </div>
            ))
        }

    </div>
    );
}

export  function PostHeader({user,image,time}) {
    return (
        <div className="profile">
            <div className="left-side">
                <div className="profile-pic">
                    <Link href="./profile"><img src={image}alt="" /></Link>
                </div>
                <span>
                    <h3>{user} .<span className="follow" title="follow">Follow</span></h3>
                    <p>{time} <sup>.</sup> <i className="fas fa-globe-africa"></i></p>
                </span>

            </div>
        </div>
    )
}

export function PostMiddle({ text, image }) {
    return (
      <>
        <div className="post-content-text">
          <pre>{text}</pre>
        </div>
  
        <div className="post-content">
          <img src={"" + image} alt="" />
        </div>
      </>
    );
  }
  
export function PostFooter() {
    return (
        <div className="liked">
            <div className="liked-icon"><i className="far fa-thumbs-up"></i> <span>15k</span></div>
            <Link href="./comment">
                <div className="liked-icon"><i className="far fa-comment"></i> <span>6k</span></div>
            </Link>
        </div>
    )
}