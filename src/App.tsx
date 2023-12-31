import { useEffect, useState } from "react"
import "tailwindcss/tailwind.css"
import { SvgCircle, SvgCircleCheck, SvgPlus, SvgTrashCan } from "./Icons"

interface Task {
    id: number,
    text: string,
    completed: boolean
}

const allPlaceholders: string[] = [
    "Make money",
    "Be happy",
    "Buy tomatoes",
    "Sell my grandmom",
    "Watch movies on TikTok",
    "Play GTA VI",
    "Download music",
    "Have a baby",
    "Listen to some podcasts",
    "Eat food",
    "Drink water",
    "Make music",
    "Say goodbye",
    "Speak a lot",
    "Learn English",
    "Be an airport",
    "Text my mom that I wanna be an lion"
]

const getPlaceholder = () => allPlaceholders[Math.floor(Math.random() * allPlaceholders.length)]

const createTask = (text: string) => ({
    id: Math.floor(Math.random() * 1000000000),
    text,
    completed: false
})

export default function App() {
    let [currentTask, setCurrentTask] = useState<string>(""),
        [allTasks, setAllTasks] = useState<any[]>([]),
        [placeholder, setPlaceholder] = useState<string>(getPlaceholder()),
        [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        // Save tasks
        if(loaded) return localStorage.setItem("todo-list", JSON.stringify(allTasks))

        // Load tasks
        let savedTasks: string | null = localStorage.getItem("todo-list")
        setAllTasks(savedTasks ? JSON.parse(savedTasks) : allPlaceholders.sort(() => Math.random() * 2 - 1).slice(0, 4).map(createTask))
        setLoaded(true)
    }, [allTasks])

    const updateCurrentTask = ({currentTarget}: any) => setCurrentTask(currentTarget.value)

    const addNewTask = () => {
        let newTask = currentTask.trim()
        newTask.length > 0 && setAllTasks([...allTasks, createTask(newTask)])
        setCurrentTask("")
        setPlaceholder(getPlaceholder())
    }

    const completeTask = (taskID: number) => setAllTasks(allTasks.map((task: Task) => task.id === taskID ? {...task, completed: !task.completed} : task))

    const deleteTask = (taskID: number) => setAllTasks(allTasks.filter(({id}: Task) => id !== taskID))

    const autocompleteInput = () => setCurrentTask(placeholder)

    let completeSVGClassName: string = "fill-gray-200 hover:fill-gray-400 active:translate-y-1 h-6 cursor-pointer"

    return (
        <main className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-gray-100">
            <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl w-full md:max-w-128 h-full shadow">
                <section className="grid grid-cols-[1fr_3rem] gap-4 w-full">
                    <input
                        type="text"
                        placeholder={placeholder}
                        onChange={updateCurrentTask}
                        onKeyDown={event => (event.key === "Enter" && addNewTask()) || (event.key === "Tab" && autocompleteInput())}
                        value={currentTask}
                        className="text-xl w-full h-12 rounded-xl px-4 border-bottom-4 border-violet-500 bg-gray-100"
                    />
                    <button
                        onClick={addNewTask}
                        className={"bg-violet-500 hover:bg-violet-400 hover:shadow active:translate-y-1 text-white text-xl size-12 rounded-xl flex items-center justify-center"}
                    ><SvgPlus className="fill-white h-6" /></button>
                </section>
                <ul className="flex flex-col w-full h-full overflow-auto bg-white custom-scroll">
                    {allTasks.length === 0 && <p className="text-xl w-full text-center text-gray-500 py-2">{loaded ? "You won't do anything? :(" : "Loading tasks..."}</p>}
                    {allTasks.map((task: Task) => (
                        <li key={"task-" + task.id} className="hover:bg-gray-100 grid grid-cols-[1.5rem_1fr_1.5rem] w-full items-center justify-center p-4 gap-4 rounded-xl">
                            {task.completed ?
                                <SvgCircleCheck className={completeSVGClassName} onClick={() => completeTask(task.id)} /> :
                                <SvgCircle className={completeSVGClassName} onClick={() => completeTask(task.id)} />
                            }
                            <span className={"text-xl " + (task.completed ? "text-gray-500 line-through" : "text-black")}>{task.text}</span>
                            <SvgTrashCan className="fill-red-500 hover:fill-red-400 active:translate-y-1 h-6 cursor-pointer" onClick={() => deleteTask(task.id)} />
                        </li>
                    ))}
                </ul>
                <a className="text-base text-gray-500 hover:underline" href="https://kevydev.github.io/portfolio/" target="_blank">
                    <p>© Made and designed by KevyDev.</p>
                </a>
            </div>
        </main>
    )
}