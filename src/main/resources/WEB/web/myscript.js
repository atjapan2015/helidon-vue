
Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

new Vue({
  el: '#notebook',

  data () {
	return {
		content: 'This is a note.',
		notes: JSON.parse(localStorage.getItem('notes')) || [],
		selectedId: localStorage.getItem('selected-id') || null,
	}
  },
  
  computed: {
	notePreview() {
		return this.selectedNote?marked(this.selectedNote.content):''
	},
	addButtonTitle() {
		return this.notes.length + ' note(s) already';
	},
	selectedNote() {
		return this.notes.find(note => note.id === this.selectedId)
	},
	sortedNotes() {
		return this.notes.slice()
		.sort((a, b) => a.created - b.created)
		.sort((a, b) => a.favorite === b.favorite ? 0
		  : a.favorite ? -1
          : 1)
	},
	linesCount() {
		if(this.selectedNote) {
			return this.selectedNote.content.split(/\r\n|\r|\n/).length		
		}
	},
	wordsCount() {
		if(this.selectedNote) {
			var s = this.selectedNote.content
			var s = this.selectedNote.content
	        // Turn new line cahracters into white-spaces
	        s = s.replace(/\n/g, ' ')
	        // Exclude start and end white-spaces
	        s = s.replace(/(^\s*)|(\s*$)/gi, '')
	        // Turn 2 or more duplicate white-spaces into 1
	        s = s.replace(/[ ]{2,}/gi, ' ')
	        // Return the number of spaces
	        return s.split(' ').length
		}
	},
	charactersCount() {
		if (this.selectedNote) {
          return this.selectedNote.content.split('').length
        }
	},
  },

  watch: {
	content: {
		handler: 'saveNote',
	},
	notes: {
		handler: 'saveNotes',
		deep: true,
	},
	selectedId(val) {
		localStorage.setItem('selected-id', val)
	},
  },

  methods: {
	saveNote() {
		console.log('saving note:', this.content)
		localStorage.setItem('content', this.content)
		this.reportOperation('saving')
	},
	reportOperation(opName) {
		console.log('THe', opName, 'operation was completed!')
		console.log('restored note:', localStorage.getItem('content'))
	},
	addNote() {
		const time = Date.now()
		const note = {
			id: String(time),
			title: 'New note ' + (this.notes.length + 1),
			content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
			created: time,
			favorite: false,
		}
		this.notes.push(note)
	},
	selectNote(note) {
		this.selectedId = note.id
	},
	saveNotes() {
		localStorage.setItem('notes', JSON.stringify(this.notes))
		console.log('Notes saved!', new Date())
	},
	removeNote() {
		if (this.selectedNote && confirm('Delete the note?')) {
			const index = this.notes.indexOf(this.selectedNote)
			if (index !== -1) {
				this.nodes.splice(index, 1)
			}
		}
	},
	favoriteNote() {
		this.selectedNote.favorite = !this.selectedNote.favorite
	},
  },
})