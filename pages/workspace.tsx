import React, { useEffect, useState } from "react";
import Main from "../components/dashboard/Main";
import Header from "../components/dashboard/Main";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/Navbar";
import { GetServerSideProps } from "next";
import { fetchUsers } from "../utils/fetchUsers";
import { GoalBody, Goals, Notes, User } from "../typings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { fetchGoals } from "../utils/fetchGoals";
import { fetchNotes } from "../utils/fetchNotes";
import toast from "react-hot-toast";
import { UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import {
  Button,
  Checkbox,
  Collapse,
  Grid,
  Input,
  Loading,
  Progress,
  Text,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import Planet from "./tracker";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import Island from "../components/BoonIsland/Island";
import Dialog from "../components/ChapterPopup/ChapterPopup";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
interface Props {
  users: User[];
  goals: Goals[];
  notes: Notes[];
}

interface RoadmapItem {
  id: number;
  title: string;
}
interface datatype {
  message: {
    choices: [
      {
        message: {
          content: string;
        };
      }
    ];
  };
}

const Home = ({ users, goals, notes }: Props) => {
  // const { activeSong } = useSelector((state: any) => state.player);
  const { isLoaded, isSignedIn, user } = useUser();

  const [goal, setGoal] = useState<Goals[]>(goals);
  const router = useRouter();
  const match = users.filter(
    (userss) => userss.email == user?.emailAddresses[0].emailAddress
  );
  const todos = goals.filter((goal) => goal.username == user?.username);
  useEffect(() => {
    if (user && !match[0].categories) {
      router.push("/categories");
    } else {
      null;
    }
  }, []);
  const [showtask, setShowTask] = useState(false);
  const [title, setTitle] = useState("");

  const refreshGoals = async () => {
    const goals: Goals[] = await fetchGoals();
    setGoal(goals);
  };

  const addGoalData = async () => {
    try {
      const postInfo: GoalBody = {
        // @ts-ignore
        _type: "goals",
        title: title,
        progress: 0,
        username: user?.username!,
        completed: false,
        delete: false,
      };
      const result = await fetch(`/api/addGoalData`, {
        body: JSON.stringify(postInfo),
        method: "POST",
      });
      const json = await result.json();
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://ownboon-practice.vercel.app/_next/image?url=%2Flogo.png&w=48&q=75"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Todos Updated
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try refreshing the page to see it!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));

      console.log(json);

      return json;
    } catch (err) {
      console.error(err);
    }
  };
  const addGoalDataSchedule = async (title: string) => {
    try {
      const postInfo: GoalBody = {
        // @ts-ignore
        _type: "goals",
        title: title,
        progress: 0,
        username: user?.username!,
        completed: false,
        delete: false,
      };
      const result = await fetch(`/api/addGoalData`, {
        body: JSON.stringify(postInfo),
        method: "POST",
      });
      const json = await result.json();
      console.log(json);
      return json;
    } catch (err) {
      console.error(err);
    }
  };

  const handlesubmit = (e: any) => {
    e.preventDefault();
    addGoalData();
    setShowTask(false);
    setTitle("");
    router.replace(router.asPath);
  };
  const [text, setText] = useState("");

  const addCompleted = async (id: string | undefined) => {
    try {
      const postInfo: Goals = {
        // @ts-ignore
        _id: id,
        completed: true,
      };
      const result = await fetch(`/api/setGoals`, {
        body: JSON.stringify(postInfo),
        method: "POST",
      });
      const json = await result.json();

      console.log(json);
      router.replace(router.asPath);

      return json;
    } catch (err) {
      console.error(err);
    }
  };
  const addUnCompleted = async (id: string | undefined) => {
    toast.custom((t) => (
      <div>
        <Loading type="default" />
      </div>
    ));
    try {
      const postInfo: Goals = {
        // @ts-ignore
        _id: id,
        completed: false,
      };
      const result = await fetch(`/api/setGoals`, {
        body: JSON.stringify(postInfo),
        method: "POST",
      });
      const json = await result.json();
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://ownboon-practice.vercel.app/_next/image?url=%2Flogo.png&w=48&q=75"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  U set ur todo to not completed
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try refreshing the page to see it!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      router.replace(router.asPath);

      console.log(json);
      return json;
    } catch (err) {
      console.error(err);
    }
  };
  const addDeleted = async (id: string | undefined) => {
    try {
      const postInfo = {
        // @ts-ignore
        _id: id,
      };
      const result = await fetch(`/api/deleteGoals`, {
        body: JSON.stringify(postInfo),
        method: "POST",
      });
      const json = await result.json();
      console.log(json);
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://ownboon-practice.vercel.app/_next/image?url=%2Flogo.png&w=48&q=75"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  U Deleted a todos
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try refreshing the page to see it!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      router.replace(router.asPath);
      return json;
    } catch (err) {
      console.error(err);
    }
  };
  const notess = notes.filter(
    (note) => note.email === user?.emailAddresses[0].emailAddress
  );

  // const handleSubmit = async (e: any) => {
  //   // e.preventDefault();
  //   const mutations: Notes = {
  //     _type: "notes",
  //     topic: '',
  //     note: text,
  //     email: user?.emailAddresses[0].emailAddress!,
  //   };

  //   const result = await fetch(`/api/addNotes`, {
  //     body: JSON.stringify(mutations),
  //     method: "POST",
  //   });

  //   const json = await result.json();
  //   return json;
  // };
  const [visible, setVisible] = useState(false);
  const [texts, setTexts] = useState("");
  const [stuff, setStuff] = useState("");
  const [desc, setDesc] = useState("");
  const [data, setData] = useState<datatype>();
  const [show, setShow] = useState(false);

  const refreshTodo = async () => {
    const todo = await fetchGoals();
    todo;
  };
  const fetchRoadmap = async (e: any) => {
    // e.preventDefault();

    setShow(true);

    const result = await fetch(`/api/roadmap/schedule?title=${desc}`);

    const json = await result.json();
    setData(json);
    setShow(false);
    return json;
  };
  const [susdata, setSusData] = useState();

  const [showModal, setShowModal] = React.useState(false);


  useEffect(() => {
    if (data) {
      // @ts-ignore
      const roadmapdata = data?.message.choices[0].message.content;
      const fine = roadmapdata.replace("@finish", "");
      const sus = JSON.parse(fine);
      setSusData(sus);
    }
  }, [data]);
  return (
    <div className="overflow-hidden bg-[#000309] flex flex-row justify-end relative font-sans w-full items-start">
      <div className="flex flex-col justify-start mt-5 gap-5 relative w-full items-end">
        <div className="border-solid border-[#1b1f3a] self-center mb-px relative w-full h-px shrink-0 border" />
        <div className="flex flex-row justify-start gap-5 relative w-full items-center mb-px mr-5">
          <div className="flex flex-col justify-start gap-5 relative w-1/3 items-center">
            <div className="border-solid border-[#1b1f3a] bg-[rgba(51,_56,_88,_0.13)] bg-[linear-gradient(0deg,_rgba(44,_211,_225,_0.2)_0%,rgba(44,_211,_225,_0)_100%)] bg-cover bg-50%_50% bg-blend-normal flex flex-col justify-start gap-2 relative w-full h-[295px] shrink-0 items-start pl-12 py-3 border rounded-lg">
              <div className="self-center flex flex-row justify-start gap-1 relative w-24 items-center">
                <div className="whitespace-nowrap text-lg font-sans text-white relative">
                  To Do List
                </div>
                <img
                  src="https://file.rendit.io/n/JmNhUvsva3wm0ElTUHoF.svg"
                  className="min-h-0 min-w-0 relative w-2 shrink-0"
                />
              </div>
              <div className="border-solid border-[#1b1f3a] self-center mb-3 relative w-40 h-px shrink-0 bordert borderb-0 borderx-0" />
              <div className="flex flex-row justify-start mb-1 gap-4 relative w-20 items-center">
                <div className="border-solid border-[#333858] mb-px relative w-6 shrink-0 h-6 border-2 rounded" />
                <div className="whitespace-nowrap  font-sans text-white relative">
                  Step 1
                </div>
              </div>
              <div className="flex flex-row justify-start mb-1 gap-4 relative w-20 items-center">
                <div className="border-solid border-[#333858] mb-px relative w-6 shrink-0 h-6 border-2 rounded" />
                <div className="whitespace-nowrap  text-[#dddddd] relative">
                  Step 1
                </div>
              </div>
              <div className="flex flex-row justify-start mb-1 gap-4 relative w-20 items-center">
                <div className="border-solid border-[#333858] mb-px relative w-6 shrink-0 h-6 border-2 rounded" />
                <div className="whitespace-nowrap  text-[#dddddd] relative">
                  Step 1
                </div>
              </div>
              <div className="flex flex-row justify-start mb-3 gap-4 relative w-20 items-center">
                <div className="border-solid border-[#333858] mb-px relative w-6 shrink-0 h-6 border-2 rounded" />
                <div className="whitespace-nowrap  text-[#dddddd] relative">
                  Step 1
                </div>
              </div>
              <div className="border-solid border-[rgba(44,_211,_225,_0.5)] bg-[rgba(51,_56,_88,_0.13)] self-center flex flex-row justify-center gap-1 relative h-10 shrink-0 items-center px-[108px] py-2 border rounded">
                <img
                  src="https://file.rendit.io/n/xqvQ4cl5AoJGfD7albqE.png"
                  className="min-h-0 min-w-0 relative w-4 shrink-0"
                />
                <div className="whitespace-nowrap text-sm font-sans text-[#dddddd] relative">
                  Add Task
                </div>
              </div>
            </div>
            <div className="border-solid border-[#1b1f3a] bg-[rgba(51,_56,_88,_0.13)] flex flex-col justify-start gap-2 relative w-full h-56 shrink-0 items-center pt-4 pb-3 border rounded-lg">
              <div className="whitespace-nowrap text-lg font-sans text-white relative">
                AI Schedule Generator{" "}
              </div>
              <div className="border-solid border-[#1b1f3a] mb-2 relative w-40 h-px shrink-0 bordert borderb-0 borderx-0" />
              <div className="text-center text-sm  text-white mb-2 relative w-3/4">
                The AI schedule generator analyzes preferences, constraints, and resources to create optimized schedules, maximizing efficiency and productivity.
              </div>
              <div className="border-solid border-[rgba(44,_211,_225,_0.5)] bg-[rgba(51,_56,_88,_0.13)] bg-[linear-gradient(89deg,_rgba(44,_211,_225,_0.2)_0%,rgba(44,_211,_225,_0.08)_18%,rgba(44,_211,_225,_0.06)_37%,rgba(44,_211,_225,_0.03)_55%,rgba(44,_211,_225,_0)_71%)] bg-cover bg-50%_50% bg-blend-normal flex flex-col justify-start relative h-10 shrink-0 items-center py-2 border rounded">
                <div className="whitespace-nowrap text-sm font-sans text-[#dddddd] relative mx-24">
                  Generate Now
                </div>
              </div>
            </div>
          </div>
          <div className="border-solid border-[#1b1f3a] bg-[rgba(51,_56,_88,_0.13)] flex flex-col items-stretch justify-start relative w-2/3 h-[542px] py-3 border rounded-lg">
            <div className="whitespace-nowrap text-lg text-center font-sans text-white relative">
              Boon Island
            </div>
            <div className="grow p-20">
              <Island users={users} />
            </div>
          </div>
        </div>
        <div className="border-solid border-[#1b1f3a] bg-[rgba(51,_56,_88,_0.13)] flex flex-row justify-center mr-5 gap-6 relative w-full items-end py-3 border rounded-lg">
          <div className="bg-[rgba(27,_31,_58,_0.25)] flex flex-col justify-start mb-4 gap-1 relative w-1/4 items-start pt-4 pb-5 px-6 rounded-lg">
            <div className="text-center whitespace-nowrap  text-white relative">
              Chapter 1
            </div>
            <div className="border-solid border-[#1b1f3a] relative w-12 h-px shrink-0 mb-1 ml-px bordert borderb-0 borderx-0" />
            <div onClick={() => setShowModal(true)} className="text-sm  text-[#dddddd] self-center relative w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequatDuis aute irure dolor in
              reprehenderit in...
            </div>
          </div>
          <div className="self-start flex flex-col justify-start mb-4 gap-2 relative w-1/4 items-center">
            <div className="flex flex-row justify-start gap-1 relative w-16 items-center">
              <div className="text-lg  text-white relative">Notes</div>
              <img
                src="https://file.rendit.io/n/JmNhUvsva3wm0ElTUHoF.svg"
                className="min-h-0 min-w-0 relative w-2 shrink-0"
              />
            </div>
            <div className="border-solid border-[#1b1f3a] mb-3 relative w-40 h-px shrink-0 bordert borderb-0 borderx-0" />
            <div className="bg-[rgba(27,_31,_58,_0.25)] flex flex-col justify-start gap-1 relative w-full items-start pt-4 pb-5 px-6 rounded-lg">
              <div className="text-center whitespace-nowrap  text-white relative">
                Chapter 1
              </div>
              <div className="border-solid border-[#1b1f3a] relative w-12 h-px shrink-0 mb-1 ml-px bordert borderb-0 borderx-0" />
              <div onClick={() => setShowModal(true)} className="text-sm  text-[#dddddd] self-center relative w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequatDuis aute irure dolor in
                reprehenderit in...
              </div>
            </div>
          </div>
          <div className="bg-[rgba(27,_31,_58,_0.25)] flex flex-col justify-start mb-4 gap-1 relative w-1/4 items-start pt-4 pb-5 px-6 rounded-lg">
            <div className="text-center whitespace-nowrap  text-white relative">
              Chapter 1
            </div>
            <div className="border-solid border-[#1b1f3a] relative w-12 h-px shrink-0 mb-1 ml-px bordert borderb-0 borderx-0" />
            <div onClick={() => setShowModal(true)} data-modal-target="defaultModal" data-modal-toggle="defaultModal" className="text-sm  text-[#dddddd] self-center relative w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequatDuis aute irure dolor in
              reprehenderit in...
            </div>
          </div>

          <Dialog isOpen={showModal} onClose={setShowModal}>
            <div className="w-[139px] h-[43px] text-white text-3xl font-semibold">Chapter 1</div>
            <div className="w-44 h-[0px] border border-neutral-400"></div>
            <div className="w-full h-[579px] text-neutral-200 text-base font-medium mt-3">Chapter 1Chapter 1Chapter 1Chapter 1Chapter 1Chapter 1Chapter 1Ch<br />apter 1Chapter 1Chapter 1Chapter </div>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await fetchUsers();
  const goals = await fetchGoals();
  const notes = await fetchNotes();

  return {
    props: {
      users,
      goals,
      notes,
    },
  };
};

const WorkspacePage = ({ users, goals, notes }: Props) => {
  return <Layout
    bgColor={'#121212'}
    icon='workspace.svg'
    text='Workspace'
    border='gray-500' hasBg={false}>
    <Home users={users} goals={goals} notes={notes} />
  </Layout>
}

export default WorkspacePage;
