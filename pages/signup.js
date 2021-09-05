import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import SocialLinks from "../components/Common/SocialLinks";
import ImageDragger from "../components/Common/ImageDragger";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import uploadPic from "../utils/uploadPicToCloudinary";
import { signupUser } from "../utils/authUser";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
let cancel;
const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
  });
  const { name, email, password, bio } = user;

  const [socialLinks, setSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const isValid = Object.values({ name, email, password, bio }).every(
      (value) => {
        return value;
      }
    );
    isValid ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const response = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new axios.CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      if (errorMsg !== null) setErrorMsg(null);
      if (response && response.data === "Available") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (err) {
      setUsernameAvailable(false);
      setErrorMsg("Username not available");
    }
    setUsernameLoading(false);
  };
  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [username]);
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
    console.log(event);
  };
  const fileChangeHandler = (event) => {
    const files = event.target.files;
    setMedia(files[0]);
    setMediaPreview(URL.createObjectURL(files[0]));
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    let profilePictureUrl;
    if (media !== null) {
      profilePictureUrl = await uploadPic(media);
    }
    if (media !== null && !profilePictureUrl) {
      setFormLoading(false);
      setErrorMsg("Picture Upload Error");
    }
    console.log("User at signup", user, profilePictureUrl);
    const response = await signupUser(
      user,
      profilePictureUrl,
      setErrorMsg,
      setFormLoading
    );
    console.log("User Registred", response);
  };
  return (
    <div className="wrapper">
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleFormSubmit}
      >
        <Message
          error
          header="Oops"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
        <Segment>
          <ImageDragger
            media={media}
            mediaPreview={mediaPreview}
            setMedia={setMedia}
            setMediaPreview={setMediaPreview}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            fileChangeHandler={fileChangeHandler}
          />
          <Form.Input
            required
            fluid
            name="name"
            error={!name}
            value={name}
            label="Name"
            icon="user"
            iconPosition="left"
            placeholder="Name"
            onChange={inputChangeHandler}
          />
          <Form.Input
            required
            fluid
            name="email"
            error={!email}
            value={email}
            label="Email"
            icon="envelope"
            iconPosition="left"
            placeholder="Email"
            type="email"
            onChange={inputChangeHandler}
          />
          <Form.Input
            required
            fluid
            name="password"
            value={password}
            label="Password"
            error={!password}
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onChange={inputChangeHandler}
          />
          <Form.Input
            required
            fluid
            loading={usernameLoading}
            error={!usernameAvailable}
            name="username"
            value={username}
            label="Username"
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            placeholder="Username"
            onChange={(e) => {
              const v = e.target.value;
              setUsername(v);
              if (regexUserName.test(v)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
          />

          <SocialLinks
            user={user}
            inputChangeHandler={inputChangeHandler}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
          />
          <Divider hidden />
          <Button
            fluid
            color="green"
            type="submit"
            content="Signup"
            size="large"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <Divider hidden />
      <FooterMessage />
    </div>
  );
};

export default Signup;
