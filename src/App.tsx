import { useState } from 'react';
import Modal from './components/Modal';
import TodoMap from './components/TodoMap';
import CategoryList from './components/CategoryList';
import ChatBubble from './components/ChatBubble';
import { Trash, BotMessageSquare, XCircle, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import { useTodos } from './hooks/useTodos';
import { useCategory } from './hooks/useCategory';
import { useChatbot } from './hooks/useChatbot';

// Funções utilitárias


function App() {
  // Estados
  const { categories, selectTodoCategory, selectedCategories, setCategories, setSelectTodoCategory, setSelectedCategories, addCategory, deleteCategory, saveSelectedCategories, handleToggleCategory } = useCategory()

  const { filteredTodos, setTodos, addTodo, deleteTodo, removeTodosByCategory, toggleTodoState } = useTodos({ selectedCategories })

  const [newTodoText, setNewTodoText] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');

  const [categoryButtonState, setCategoryButtonState] = useState<'normal' | 'delete'>('normal');

  const [showModal, setShowModal] = useState(false);

  const [categoriesView, setCategoriesView] = useState(false)
  const [chatBotView, setChatBotView] = useState(false)

  // Utiliza o novo custom hook para a lógica do chatbot
  const { messages, userInput, isLoading, handleKeyPress, setUserInput } = useChatbot({
    categories,
    setCategories,
    setTodos,
    newCategoryName,
    selectTodoCategory,
  });

  // Renderização
  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white flex gap-[0%] flex-wrap content-start">
      {!categoriesView ?
        <div className="w-screen h-screen overflow-auto flex flex-col p-4 border-r-1 border-gray-800 pr-2 md:max-w-[250px]">
          <div className="border-b-1 border-gray-800 pb-2 flex items-center justify-between">
            <div className='flex items-center'>
              <button
                onClick={() => setCategoriesView(!categoriesView)}
              >
                {categoriesView ? <></> : <ArrowLeftToLine />}
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
              >
                Nova Categoria
              </button>
              <button
                onClick={() => setCategoryButtonState(categoryButtonState === 'delete' ? 'normal' : 'delete')}
              >
                <Trash color={categoryButtonState === 'delete' ? 'red' : 'green'} />
              </button>
            </div>
            <ThemeToggle className='flex md:hidden' />
          </div>
          <CategoryList
            categories={categories.map(c => c.name)}
            selectedListCategory={selectedCategories}
            categoryButtonState={categoryButtonState}
            onCategoryClick={handleToggleCategory}
            onCategoryDelete={async (name) => {
              const cat = categories.find(c => c.name === name);
              if (cat) {
                await deleteCategory(cat.id, cat.name);
                await removeTodosByCategory(cat.name);
                const updatedSelected = selectedCategories.filter((cat) => cat !== name);
                setSelectedCategories(updatedSelected);
                await saveSelectedCategories(updatedSelected);
              }
            }}
          />
          <Modal
            show={showModal}
            title="Adicionar Categoria"
            inputValue={newCategoryName}
            onInputChange={(e) => setNewCategoryName(e.target.value)}
            onAdd={() => { addCategory(newCategoryName); setShowModal(false) }}
            onCancel={() => setShowModal(false)}
          />
        </div>
        : <></>}


      {categories.length !== 0 && (
        <div className="grow h-3/4 w-auto p-4">
          <div className='border-b-1 border-gray-800 pb-1 flex justify-center md:justify-between items-center'>
            <button onClick={() => setCategoriesView(!categoriesView)}>
              {categoriesView ? <ArrowRightToLine /> : <></>}
            </button>
            <div className='flex items-center justify-center'>
              <input
                type="text"
                value={newTodoText}
                onKeyUp={(e) => { if (e.key === 'Enter') { addTodo(newTodoText, selectTodoCategory); setNewTodoText('') } }}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Nova tarefa"
                className="px-4 py-2 m-3 w-25 md:w-auto rounded-lg border border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white "
              />
              {categories && (
                <select
                  value={selectTodoCategory}
                  onChange={(e) => setSelectTodoCategory(e.target.value)}
                  className="px-4 py-2 m-3 rounded-lg border border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white max-w-25"
                >
                  {categories.map((cat) => (
                    <option className='break-words max-w-[0.1ch]' key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>
            <ThemeToggle className='hidden md:flex' />
          </div>
          <TodoMap
            todos={filteredTodos}
            onDeleteTodo={deleteTodo}
            onToggle={toggleTodoState}
          />
        </div>
      )}
      <div className='fixed bottom-10 right-10 max-h-100 bg-blue-700 text-white dark:bg-gray-800 rounded-2xl p-1'>
        {chatBotView ?
          <div className='overflow-auto max-h-80'>
            {messages.map((msg, index) => (
              <ChatBubble key={index} msg={msg} />
            ))}
            {isLoading && <p className="loading">Gerando resposta...</p>}
          </div>
          : <></>
        }
        <div className='p-3 flex content-center'>
          {chatBotView ?
            <input
              className='px-4 py-2 mr-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Digite aqui (ex: 'Me faça um todo para como fazer uma aplicação React')"
            /> : <></>
          }
          <button onClick={() => { setChatBotView(!chatBotView) }} className='m-0 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
            {chatBotView ? <XCircle /> : <BotMessageSquare />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;