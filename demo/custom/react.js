class GreetingElement extends HTMLElement {
  constructor() {
    super();
    this.name = 'Stranger';
  }
  connectedCallback() {
    this.addEventListener('click', e => alert(`Hello, ${this.name}!`));
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'name') {
      if (newValue) {
        this.name = newValue;
      } else {
        this.name = 'Stranger';
      }
    }
  }
}
GreetingElement.observedAttributes = ['name'];
customElements.define('my-button', GreetingElement);




html.CommentItem = ({ author = 'Anonymous', text }) => html`
  <div>
    <strong>${author}</strong>: ${text}
  </div>
`;

html.CommentList = ({ list }) => (
  list.map(({ author, text }) => html`
    <CommentItem author=${author} text=${text} />
  `)
);

html.CommentForm = ({ onAdd }) => html`
  <form onSubmit=${e => onAdd(parse(e.target))}>
    Author: <input name="author" placeholder="Anonymous" />
    Text*: <input name="text" placeholder="..." required />
  </form>
`;

html.CommentBox = state => {
  if (!state.comments) return fetchComments(state);
  return html`
    <CommentList items=${state.comments} />
    <CommentForm onAdd=${data => state.comments.push(data)}/>
  `;
});

// Same-same
html.CommentBox = state => {
  if (!state.comments) return fetchComments(state);
  return render(
    html.CommentList({ items: state.comments }),
    html.CommentForm({ onAdd: data => state.comments.push(data) })
  );
});

render(html`<CommentBox>`, '#root');
render(html.CommentBox(), '#root');



const CommentItem = () => html`Hello!`;
html.CommentItem = CommentItem;

expect(CommentItem).toBe(html.CommentItem); // throws an error








const fetchComments = state => {
  if (state.loading) return 'loading...';
  state.loading = true;
  fetch('/comments').then(res => res.json()).then(({ comments }) => {
    state.comments = comments;
    state.loading = false;
  });
  return 'loading...';
};
