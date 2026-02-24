--
-- PostgreSQL database dump
--

\restrict XiCBB1pC5EHQx0bDUIWQGiN0LRdbZwYYv7zgsFrPLrhKIN84rg8GARQT3H6Kb9u

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_events (
    id bigint NOT NULL,
    name text NOT NULL,
    category text,
    label text,
    value double precision,
    metadata jsonb,
    session_id text,
    ip_address text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.analytics_events OWNER TO postgres;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_events_id_seq OWNER TO postgres;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_events_id_seq OWNED BY public.analytics_events.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_keys (
    id text NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    key_hash text NOT NULL,
    permissions jsonb,
    rate_limit integer DEFAULT 1000 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_used_at timestamp(3) without time zone,
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.api_keys OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id text,
    action text NOT NULL,
    resource text,
    resource_id text,
    ip_address text,
    user_agent text,
    success boolean DEFAULT true NOT NULL,
    failure_reason text,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    color text,
    is_active boolean DEFAULT true NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.blog_categories OWNER TO postgres;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    featured_image text,
    author_id text,
    author_name text NOT NULL,
    category text NOT NULL,
    tags text[],
    status text DEFAULT 'draft'::text NOT NULL,
    published_at timestamp(3) without time zone,
    featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    read_time integer,
    meta_title text,
    meta_description text,
    og_image text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: client_logos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_logos (
    id text NOT NULL,
    name text NOT NULL,
    logo_url text NOT NULL,
    website_url text,
    industry text,
    is_active boolean DEFAULT true NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.client_logos OWNER TO postgres;

--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text,
    message text NOT NULL,
    phone text,
    company text,
    is_read boolean DEFAULT false NOT NULL,
    is_replied boolean DEFAULT false NOT NULL,
    replied_at timestamp(3) without time zone,
    reply text,
    ip_address text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text,
    is_active boolean DEFAULT true NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    helpful integer DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id text NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    size integer NOT NULL,
    url text NOT NULL,
    thumbnail_url text,
    alt_text text,
    folder text DEFAULT 'general'::text,
    width integer,
    height integer,
    uploaded_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newsletter_subscribers (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    is_active boolean DEFAULT true NOT NULL,
    subscribed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    unsubscribed_at timestamp(3) without time zone,
    source text,
    ip_address text
);


ALTER TABLE public.newsletter_subscribers OWNER TO postgres;

--
-- Name: page_views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_views (
    id bigint NOT NULL,
    path text NOT NULL,
    referrer text,
    user_agent text,
    ip_address text,
    country text,
    city text,
    device text,
    browser text,
    session_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.page_views OWNER TO postgres;

--
-- Name: page_views_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.page_views_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_views_id_seq OWNER TO postgres;

--
-- Name: page_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.page_views_id_seq OWNED BY public.page_views.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    resource text NOT NULL,
    action text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: project_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_metrics (
    id integer NOT NULL,
    project_id text NOT NULL,
    metric text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.project_metrics OWNER TO postgres;

--
-- Name: project_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_metrics_id_seq OWNER TO postgres;

--
-- Name: project_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_metrics_id_seq OWNED BY public.project_metrics.id;


--
-- Name: project_technologies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_technologies (
    id text NOT NULL,
    project_id text NOT NULL,
    technology_id text NOT NULL
);


ALTER TABLE public.project_technologies OWNER TO postgres;

--
-- Name: project_testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_testimonials (
    id integer NOT NULL,
    project_id text NOT NULL,
    quote text NOT NULL,
    author text NOT NULL,
    role text NOT NULL,
    company text NOT NULL
);


ALTER TABLE public.project_testimonials OWNER TO postgres;

--
-- Name: project_testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_testimonials_id_seq OWNER TO postgres;

--
-- Name: project_testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_testimonials_id_seq OWNED BY public.project_testimonials.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    full_description text,
    category text NOT NULL,
    client_name text,
    industry text,
    technologies text[],
    hero_image text,
    gallery_images text[],
    challenge text,
    solution text,
    project_url text,
    github_url text,
    year text,
    duration text,
    team_size text,
    featured boolean DEFAULT false NOT NULL,
    published boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    meta_title text,
    meta_description text,
    og_image text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address text,
    user_agent text
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: research_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.research_projects (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'ongoing'::text NOT NULL,
    category text NOT NULL,
    technologies text[],
    team_members text[],
    thumbnail_url text,
    gallery_images text[],
    objectives text,
    methodology text,
    results text,
    publications jsonb,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    is_public boolean DEFAULT false NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    meta_title text,
    meta_description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.research_projects OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    subtitle text,
    description text NOT NULL,
    icon text,
    features text[],
    process jsonb,
    deliverables text[],
    pricing jsonb,
    is_active boolean DEFAULT true NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    meta_title text,
    meta_description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    "group" text DEFAULT 'general'::text NOT NULL,
    label text,
    type text DEFAULT 'string'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stats (
    id text NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    suffix text,
    description text,
    icon text,
    is_active boolean DEFAULT true NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.stats OWNER TO postgres;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    role text NOT NULL,
    department text,
    bio text,
    expertise text[],
    avatar_url text,
    email text,
    phone text,
    linkedin_url text,
    twitter_url text,
    github_url text,
    website_url text,
    is_active boolean DEFAULT true NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    joined_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: technologies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technologies (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    icon text,
    icon_type text DEFAULT 'devicon'::text NOT NULL,
    color text,
    category text,
    description text,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.technologies OWNER TO postgres;

--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.testimonials (
    id text NOT NULL,
    client_name text NOT NULL,
    client_role text,
    company text,
    content text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    avatar_url text,
    featured boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.testimonials OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id text NOT NULL,
    role_id integer NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assigned_by text
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    name text NOT NULL,
    avatar_url text,
    email_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: analytics_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events ALTER COLUMN id SET DEFAULT nextval('public.analytics_events_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: page_views id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views ALTER COLUMN id SET DEFAULT nextval('public.page_views_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: project_metrics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_metrics ALTER COLUMN id SET DEFAULT nextval('public.project_metrics_id_seq'::regclass);


--
-- Name: project_testimonials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_testimonials ALTER COLUMN id SET DEFAULT nextval('public.project_testimonials_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics_events (id, name, category, label, value, metadata, session_id, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_keys (id, user_id, name, key_hash, permissions, rate_limit, is_active, last_used_at, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, resource, resource_id, ip_address, user_agent, success, failure_reason, metadata, created_at) FROM stdin;
1	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	curl/8.17.0	t	\N	\N	2026-02-11 14:36:31.343
2	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	curl/8.17.0	t	\N	\N	2026-02-11 14:38:53.244
3	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-11 15:17:14.994
4	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-11 16:03:09.263
5	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-11 20:02:14.605
38	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-13 12:47:31.041
39	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-13 12:47:35.927
40	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-13 12:48:00.53
41	81babb61-930a-4e03-b3bd-40936363d7ff	login	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	t	\N	\N	2026-02-18 17:25:57.342
\.


--
-- Data for Name: blog_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_categories (id, name, slug, description, color, is_active, order_index, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, title, slug, excerpt, content, featured_image, author_id, author_name, category, tags, status, published_at, featured, view_count, read_time, meta_title, meta_description, og_image, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: client_logos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_logos (id, name, logo_url, website_url, industry, is_active, order_index, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, name, email, subject, message, phone, company, is_read, is_replied, replied_at, reply, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, question, answer, category, is_active, view_count, helpful, order_index, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, filename, original_name, mime_type, size, url, thumbnail_url, alt_text, folder, width, height, uploaded_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newsletter_subscribers (id, email, name, is_active, subscribed_at, unsubscribed_at, source, ip_address) FROM stdin;
\.


--
-- Data for Name: page_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_views (id, path, referrer, user_agent, ip_address, country, city, device, browser, session_id, created_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, resource, action, description, created_at) FROM stdin;
1	projects	create	create projects	2026-02-11 13:54:59.352
2	projects	read	read projects	2026-02-11 13:54:59.358
3	projects	update	update projects	2026-02-11 13:54:59.362
4	projects	delete	delete projects	2026-02-11 13:54:59.366
5	services	create	create services	2026-02-11 13:54:59.37
6	services	read	read services	2026-02-11 13:54:59.374
7	services	update	update services	2026-02-11 13:54:59.378
8	services	delete	delete services	2026-02-11 13:54:59.381
9	testimonials	create	create testimonials	2026-02-11 13:54:59.386
10	testimonials	read	read testimonials	2026-02-11 13:54:59.398
11	testimonials	update	update testimonials	2026-02-11 13:54:59.403
12	testimonials	delete	delete testimonials	2026-02-11 13:54:59.408
13	faqs	create	create faqs	2026-02-11 13:54:59.412
14	faqs	read	read faqs	2026-02-11 13:54:59.416
15	faqs	update	update faqs	2026-02-11 13:54:59.421
16	faqs	delete	delete faqs	2026-02-11 13:54:59.434
17	client_logos	create	create client_logos	2026-02-11 13:54:59.441
18	client_logos	read	read client_logos	2026-02-11 13:54:59.446
19	client_logos	update	update client_logos	2026-02-11 13:54:59.45
20	client_logos	delete	delete client_logos	2026-02-11 13:54:59.455
21	stats	create	create stats	2026-02-11 13:54:59.459
22	stats	read	read stats	2026-02-11 13:54:59.462
23	stats	update	update stats	2026-02-11 13:54:59.465
24	stats	delete	delete stats	2026-02-11 13:54:59.468
25	media	create	create media	2026-02-11 13:54:59.471
26	media	read	read media	2026-02-11 13:54:59.475
27	media	update	update media	2026-02-11 13:54:59.479
28	media	delete	delete media	2026-02-11 13:54:59.482
29	users	create	create users	2026-02-11 13:54:59.485
30	users	read	read users	2026-02-11 13:54:59.489
31	users	update	update users	2026-02-11 13:54:59.492
32	users	delete	delete users	2026-02-11 13:54:59.496
33	settings	create	create settings	2026-02-11 13:54:59.509
34	settings	read	read settings	2026-02-11 13:54:59.515
35	settings	update	update settings	2026-02-11 13:54:59.52
36	settings	delete	delete settings	2026-02-11 13:54:59.524
37	analytics	create	create analytics	2026-02-11 13:54:59.527
38	analytics	read	read analytics	2026-02-11 13:54:59.529
39	analytics	update	update analytics	2026-02-11 13:54:59.532
40	analytics	delete	delete analytics	2026-02-11 13:54:59.536
41	contacts	create	create contacts	2026-02-11 13:54:59.539
42	contacts	read	read contacts	2026-02-11 13:54:59.541
43	contacts	update	update contacts	2026-02-11 13:54:59.544
44	contacts	delete	delete contacts	2026-02-11 13:54:59.547
45	newsletter	create	create newsletter	2026-02-11 13:54:59.55
46	newsletter	read	read newsletter	2026-02-11 13:54:59.554
47	newsletter	update	update newsletter	2026-02-11 13:54:59.557
48	newsletter	delete	delete newsletter	2026-02-11 13:54:59.562
49	projects	publish	Publish/unpublish projects	2026-02-11 13:54:59.565
50	settings	system	Modify system settings	2026-02-11 13:54:59.569
51	users	assign_roles	Assign roles to users	2026-02-11 13:54:59.572
52	analytics	export	Export analytics reports	2026-02-11 13:54:59.575
53	newsletter	export	Export newsletter subscribers	2026-02-11 13:54:59.578
\.


--
-- Data for Name: project_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_metrics (id, project_id, metric, value) FROM stdin;
1	4441ebdf-2d14-4759-b59b-c6bffd704a06	Transcription Accuracy	98%
2	4441ebdf-2d14-4759-b59b-c6bffd704a06	Response Time	<2s
3	4441ebdf-2d14-4759-b59b-c6bffd704a06	Face Recognition Accuracy	99.5%
4	4441ebdf-2d14-4759-b59b-c6bffd704a06	User Satisfaction	95%
5	b341e77d-e44f-46c3-9d44-6e12a73edd1b	Sales Efficiency	+75%
6	b341e77d-e44f-46c3-9d44-6e12a73edd1b	Customer Response Time	-60%
7	b341e77d-e44f-46c3-9d44-6e12a73edd1b	Data Processing Speed	8x faster
8	b341e77d-e44f-46c3-9d44-6e12a73edd1b	User Adoption Rate	92%
9	32a8e7f8-5800-4c19-a9d6-b1b017c721a9	Brand Recognition	+65%
10	32a8e7f8-5800-4c19-a9d6-b1b017c721a9	Social Media Engagement	+90%
11	32a8e7f8-5800-4c19-a9d6-b1b017c721a9	Website Traffic	+120%
12	32a8e7f8-5800-4c19-a9d6-b1b017c721a9	Lead Quality Score	+40%
13	0a3a9ee5-0fd3-45a1-966d-83d3e6eb45c3	Online Reservations	+85%
14	0a3a9ee5-0fd3-45a1-966d-83d3e6eb45c3	Website Traffic	+150%
15	0a3a9ee5-0fd3-45a1-966d-83d3e6eb45c3	Mobile Conversion	+120%
16	0a3a9ee5-0fd3-45a1-966d-83d3e6eb45c3	Customer Satisfaction	96%
17	8f2c2523-2f7b-49af-9054-f44eb9500e32	Active Users	50K+
18	8f2c2523-2f7b-49af-9054-f44eb9500e32	Daily Engagement	25 min avg
19	8f2c2523-2f7b-49af-9054-f44eb9500e32	App Store Rating	4.8/5
20	8f2c2523-2f7b-49af-9054-f44eb9500e32	User Retention (30 days)	75%
\.


--
-- Data for Name: project_technologies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_technologies (id, project_id, technology_id) FROM stdin;
\.


--
-- Data for Name: project_testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_testimonials (id, project_id, quote, author, role, company) FROM stdin;
1	4441ebdf-2d14-4759-b59b-c6bffd704a06	The AI Vocal Expert revolutionized our customer service. The accuracy and security features are outstanding.	David Martinez	CTO	VoiceTech Solutions
2	b341e77d-e44f-46c3-9d44-6e12a73edd1b	GS Dashboard revolutionized our sales process. The automation and insights have been game-changing for our business.	Jennifer Williams	VP of Sales	Global Solutions Inc
3	32a8e7f8-5800-4c19-a9d6-b1b017c721a9	Our new brand identity has exceeded all expectations. We've seen tremendous growth since the launch.	Emily Rodriguez	CMO	TechVision
4	0a3a9ee5-0fd3-45a1-966d-83d3e6eb45c3	The new website has transformed how customers discover and book our restaurant. It perfectly captures our brand.	Marco Giovanni	Owner & Chef	Grilli Restaurant
5	8f2c2523-2f7b-49af-9054-f44eb9500e32	The app has transformed how our members engage with fitness. Retention is at an all-time high.	David Park	Founder	FitLife Pro
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, title, slug, description, full_description, category, client_name, industry, technologies, hero_image, gallery_images, challenge, solution, project_url, github_url, year, duration, team_size, featured, published, view_count, order_index, meta_title, meta_description, og_image, created_at, updated_at) FROM stdin;
b341e77d-e44f-46c3-9d44-6e12a73edd1b	GS Dashboard	gs-dashboard	A complete CRM dashboard system with complex data management, analytics, and automation features.	Developed a comprehensive CRM dashboard system that streamlines customer relationship management with advanced features. The platform includes customer tracking, sales pipeline management, automated workflows, detailed analytics, and real-time reporting capabilities for enterprise-level operations.	Web Development	\N	\N	{React,TypeScript,Node.js,PostgreSQL,Redux}	/images/gs.png	{/images/gs.png,/projects/gs-2.jpg,/projects/gs-3.jpg,/projects/gs-4.jpg}	The client needed a powerful yet intuitive CRM system that could handle complex business processes, manage large volumes of customer data, and provide actionable insights while being easy to use for their sales and support teams.	Built a robust full-stack application with React and TypeScript for a responsive frontend, Node.js backend for efficient data processing, and PostgreSQL for reliable data storage. Implemented Redux for state management, custom analytics engine, and automated workflow system.	\N	\N	2024	\N	\N	t	t	0	0	\N	\N	\N	2024-08-25 00:00:00	2026-02-13 13:34:35.431
15176406-4407-4961-b7ca-6cbbd841c5ff	LOGBOG	logbog	React app in which authenticated users can post their blogs. A wide dynamic blogging app.	Built a full-stack blogging web application with a complete frontend, backend, and database architecture. The platform allows users to securely register and authenticate, create personal profiles, and publish high-quality blog content through an intuitive and visually appealing interface.\n\nThe application supports creating, editing, updating, and deleting blog posts, giving users full control over their content. A rich text editor enables well-formatted, engaging posts, while a responsive and modern UI ensures an excellent reading and writing experience across desktops, tablets, and mobile devices.\n\nOn the backend, a robust server and database system manage user authentication, blog data, comments, and permissions, ensuring security, scalability, and smooth performance. The platform also includes features such as commenting, content management, and real-time updates, making it a complete and production-ready blogging solution.\n\nThis project demonstrates strong expertise in full-stack web development, combining clean UI design, efficient backend logic, and reliable database management to deliver a seamless and beautiful user experience.	Web Development	\N	\N	{React,TypeScript,Node.js,MongoDB,Express}	/images/logbog.png	{/images/logbog.png,/projects/logbog-2.jpg,/projects/logbog-3.jpg,/projects/logbog-4.jpg}	The client needed a user-friendly blogging platform that allows multiple users to contribute content while maintaining security and providing an engaging reading experience for visitors.	Implemented a full-stack solution with React for the frontend, Node.js and Express for the backend API, and MongoDB for data storage. Added authentication using JWT tokens and implemented a rich text editor for content creation.	https://logbog.vercel.app/	\N	2024	\N	\N	t	t	0	0	\N	\N	\N	2024-10-15 00:00:00	2026-02-13 13:34:33.169
0a3a9ee5-0fd3-45a1-966d-83d3e6eb45c3	Grilli	grilli-restaurant	A great restaurant website with elegant design, online reservations, and dynamic menu management.	Crafted an exceptional restaurant website for Grilli that captures the essence of fine dining. Features include an elegant, responsive design, online reservation system, dynamic menu management, gallery showcase, and seamless user experience that drives customer engagement and bookings.	Web Development	\N	\N	{Next.js,React,"Tailwind CSS","Framer Motion","Sanity CMS"}	/images/grilli.png	{/images/grilli.png,/projects/grilli-2.jpg,/projects/grilli-3.jpg,/projects/grilli-4.jpg}	The restaurant needed a sophisticated online presence that reflected their premium dining experience while making it easy for customers to view menus, make reservations, and learn about special events.	Developed a stunning website using Next.js with smooth animations via Framer Motion. Integrated Sanity CMS for easy menu updates, implemented a custom reservation system, and optimized for mobile users who are often browsing on-the-go.	https://grilli-master-one.vercel.app/	\N	2024	\N	\N	t	t	0	0	\N	\N	\N	2024-07-25 00:00:00	2026-02-13 13:34:36.018
8f2c2523-2f7b-49af-9054-f44eb9500e32	Fitness Tracking Mobile App	mobile-fitness-app	Cross-platform fitness app with workout tracking, nutrition logging, and social features.	Designed and developed a comprehensive fitness application that helps users track workouts, monitor nutrition, and connect with fitness communities. Integrated with device health APIs for automatic activity tracking and provided personalized workout recommendations.	Mobile Development	\N	\N	{"React Native",Firebase,HealthKit,Redux}	/projects/fitness-hero.jpg	{/projects/fitness-1.jpg,/projects/fitness-2.jpg,/projects/fitness-3.jpg}	Creating a unified experience across iOS and Android while integrating with platform-specific health APIs. The app needed to work offline, sync data seamlessly, and provide real-time workout tracking without draining battery life.	Used React Native for cross-platform development with native modules for health integrations. Implemented efficient data sync with Firebase, offline-first architecture, and optimized background processes. Added gamification features to boost user engagement.	\N	\N	2024	\N	\N	f	t	0	0	\N	\N	\N	2024-06-05 00:00:00	2026-02-13 13:38:24.783
4441ebdf-2d14-4759-b59b-c6bffd704a06	AI Vocal Expert	ai-vocal-expert	An AI vocal expert that can transcribe vocals and respond with face authentication for secure access.	Developed an advanced AI-powered vocal assistant that combines speech recognition, natural language processing, and facial authentication. The system can transcribe conversations in real-time, provide intelligent responses, and ensures secure access through biometric face recognition technology.	AI & Machine Learning	\N	\N	{Python,TensorFlow,OpenAI,"Face Recognition","Speech Recognition"}	/images/vocalexpert.png	{/images/vocalexpert.png,/projects/vocal-2.jpg,/projects/vocal-3.jpg,/projects/vocal-4.jpg}	Create a secure, intelligent voice assistant that could accurately transcribe speech, understand context, and verify user identity through facial recognition while maintaining privacy and security standards.	Integrated cutting-edge AI models for speech-to-text transcription, implemented OpenAI for intelligent responses, and used advanced facial recognition algorithms for biometric authentication. Built a secure pipeline that processes voice and video data in real-time.	\N	\N	2024	\N	\N	t	t	0	0	\N	\N	\N	2024-09-20 00:00:00	2026-02-13 13:34:33.942
32a8e7f8-5800-4c19-a9d6-b1b017c721a9	Complete Brand Identity Redesign	brand-identity-redesign	Comprehensive brand refresh including logo, color palette, and brand guidelines.	Led a complete brand transformation for a growing tech startup. Created a modern, memorable brand identity that reflects their innovative spirit and appeals to their target audience. Delivered comprehensive brand guidelines, logo variations, and marketing collateral.	Brand Design	\N	\N	{Figma,"Adobe Suite","Brand Strategy"}	/images/carosal-3.jpg	{/projects/brand-1.jpg,/projects/brand-2.jpg,/projects/brand-3.jpg,/projects/brand-4.jpg,/projects/brand-5.jpg}	The company had outgrown their original brand identity and needed a refresh that would position them as industry leaders while maintaining some brand recognition. They needed a cohesive system that could scale across digital and print media.	Conducted extensive brand workshops, competitor analysis, and customer research. Developed a bold new visual identity with a versatile logo system, vibrant color palette, and custom typography. Created detailed brand guidelines to ensure consistency across all touchpoints.	\N	\N	2024	\N	\N	t	t	0	0	\N	\N	\N	2024-07-10 00:00:00	2026-02-13 13:34:37.031
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token, expires_at, created_at, ip_address, user_agent) FROM stdin;
a66c0b80-2b86-4709-a6cd-2efe582b8bc6	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDgyMDU5MSwiZXhwIjoxNzcxNDI1MzkxfQ.waq7Aoarw3-4lbZGV0pgwKcZWBDtbn5vtuvXC12uYU8	2026-02-18 14:36:31.304	2026-02-11 14:36:31.306	::1	curl/8.17.0
b56d4a62-d89c-4aed-804c-04b69a0011ee	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDgyMDczMywiZXhwIjoxNzcxNDI1NTMzfQ.LZsivU4mO2MuNQVD6BW98Qc1wyCPYf0wZmBL333c1zg	2026-02-18 14:38:53.236	2026-02-11 14:38:53.238	::1	curl/8.17.0
d34d474e-7ac5-4c5c-8c70-a98f7822853f	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDgyMzAzNCwiZXhwIjoxNzcxNDI3ODM0fQ.3rSdMUAuY22tcWpipT2qozpdyaQKfjpeaLgjDTxWrBQ	2026-02-18 15:17:14.955	2026-02-11 15:17:14.957	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
8aabcdd6-5bc9-4863-b1d4-83bf48dc6edd	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDg0MDEwMCwiZXhwIjoxNzcxNDQ0OTAwfQ.74DVLIsMYsWilgKTUYxDKcEHHtxLv0F4ID1dfUI5XMY	2026-02-18 20:01:40.634	2026-02-11 20:01:40.638	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
1b1a3535-aa10-45a7-8fbb-6cd164a7c2a4	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDg0MDEzNCwiZXhwIjoxNzcxNDQ0OTM0fQ.CBZ_xwJhNp53RSN7z57_KeGU5Ip7iuYQCPouKJg-NdU	2026-02-18 20:02:14.577	2026-02-11 20:02:14.579	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
ab5dc51a-04b8-4dd9-9f19-3f317b906e6e	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDk4Njg1MCwiZXhwIjoxNzcxNTkxNjUwfQ.12ozCwCYdomtGNuwMBb1wjMtU0_K9Klx7V7rueo-bmE	2026-02-20 12:47:30.926	2026-02-13 12:47:30.934	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
11c70fa6-ce06-44e9-8570-fe6450b06d1d	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MDk4Njg1NSwiZXhwIjoxNzcxNTkxNjU1fQ.g9Xnt78RCTTQYuZlENyfo3GE6-acscjL0I_bQPNlPkA	2026-02-20 12:47:35.844	2026-02-13 12:47:35.846	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
fbdca1f0-ebff-4868-bf09-788deffd0cfa	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MTQzNTU0NiwiZXhwIjoxNzcyMDQwMzQ2fQ.gcq9E1_4Guz3U6vx9wGt4MOKnNVi16obWfeYwzmhj0o	2026-02-25 17:25:46.123	2026-02-18 17:25:46.126	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
739615d2-7a19-4ee6-95ce-e21b2cdad657	81babb61-930a-4e03-b3bd-40936363d7ff	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWJhYmI2MS05MzBhLTRlMDMtYjNiZC00MDkzNjM2M2Q3ZmYiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MTQzNTU1NywiZXhwIjoxNzcyMDQwMzU3fQ.2mh1mbAaXXwmGMUBD7y5LWj7PeyiVwn0btiFaNpDpt4	2026-02-25 17:25:57.326	2026-02-18 17:25:57.328	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
\.


--
-- Data for Name: research_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.research_projects (id, title, slug, description, status, category, technologies, team_members, thumbnail_url, gallery_images, objectives, methodology, results, publications, start_date, end_date, is_public, featured, order_index, meta_title, meta_description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
4	1
4	2
4	3
4	4
4	5
4	6
4	7
4	8
4	9
4	10
4	11
4	12
4	13
4	14
4	15
4	16
4	17
4	18
4	19
4	20
4	21
4	22
4	23
4	24
4	25
4	26
4	27
4	28
4	29
4	30
4	31
4	32
4	33
4	34
4	35
4	36
4	37
4	38
4	39
4	40
4	41
4	42
4	43
4	44
4	45
4	46
4	47
4	48
4	49
4	50
4	51
4	52
4	53
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
1	10
1	11
1	12
1	13
1	14
1	15
1	16
1	17
1	18
1	19
1	20
1	21
1	22
1	23
1	24
1	25
1	26
1	27
1	28
1	29
1	30
1	31
1	33
1	34
1	35
1	36
1	37
1	38
1	39
1	40
1	41
1	42
1	43
1	44
1	45
1	46
1	47
1	48
1	49
1	52
1	53
2	1
2	2
2	3
2	5
2	6
2	7
2	9
2	10
2	11
2	13
2	14
2	15
2	17
2	18
2	19
2	21
2	22
2	23
2	25
2	26
2	27
2	38
2	42
2	43
2	49
2	52
3	2
3	6
3	10
3	14
3	18
3	22
3	26
3	38
3	42
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at) FROM stdin;
1	admin	Most access, cannot manage system settings	2026-02-11 13:54:59.182
2	editor	Content management only	2026-02-11 13:54:59.182
3	viewer	Read-only access	2026-02-11 13:54:59.182
4	super_admin	Full system access	2026-02-11 13:54:59.182
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, title, slug, subtitle, description, icon, features, process, deliverables, pricing, is_active, featured, order_index, meta_title, meta_description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, key, value, "group", label, type, created_at, updated_at) FROM stdin;
47b07dd1-b303-423e-b3ea-b9323a63cd84	site_name	"\\"ASAGUS\\""	general	Site Name	string	2026-02-11 13:55:00.565	2026-02-11 13:55:00.565
81ea9fe8-fcbc-41ff-926a-0ebadfadab72	site_description	"\\"AI, Cybersecurity & Web Development Solutions\\""	general	Site Description	string	2026-02-11 13:55:00.575	2026-02-11 13:55:00.575
af090610-3866-4af9-9049-f9ba731d5e84	site_url	"\\"https://asagus.com\\""	general	Site URL	string	2026-02-11 13:55:00.579	2026-02-11 13:55:00.579
f6412a0c-ad32-48c7-9ea9-56d8d0f86add	contact_email	"\\"contact@asagus.com\\""	general	Contact Email	string	2026-02-11 13:55:00.582	2026-02-11 13:55:00.582
2cda1719-6ee3-4309-89f6-2b8dd8947d1c	social_github	"\\"https://github.com/asagus\\""	social	GitHub URL	string	2026-02-11 13:55:00.587	2026-02-11 13:55:00.587
47fc2719-ba8b-4ba4-9879-fc32938b16b5	social_linkedin	"\\"\\""	social	LinkedIn URL	string	2026-02-11 13:55:00.591	2026-02-11 13:55:00.591
58827c84-b06f-4c11-aea4-b1d2b06be43a	social_twitter	"\\"\\""	social	Twitter URL	string	2026-02-11 13:55:00.596	2026-02-11 13:55:00.596
cb741553-263a-43af-b249-26801c8ec3c4	maintenance_mode	"false"	general	Maintenance Mode	boolean	2026-02-11 13:55:00.601	2026-02-11 13:55:00.601
\.


--
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stats (id, label, value, suffix, description, icon, is_active, order_index, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, name, slug, role, department, bio, expertise, avatar_url, email, phone, linkedin_url, twitter_url, github_url, website_url, is_active, featured, order_index, joined_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: technologies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.technologies (id, name, slug, icon, icon_type, color, category, description, order_index, created_at, updated_at) FROM stdin;
e39ee63d-230b-4d22-9836-79d895200bcf	React	react	devicon-react-original	devicon	#61DAFB	Frontend	\N	0	2026-02-13 13:30:02.242	2026-02-13 13:30:02.242
9d5850fc-c04f-495f-b08d-f4b7e4959670	Next.js	nextjs	devicon-nextjs-original	devicon	#000000	Frontend	\N	0	2026-02-13 13:30:02.258	2026-02-13 13:30:02.258
972eae67-fbab-4dad-8ae0-7a7fea3182c4	Vue.js	vuejs	devicon-vuejs-original	devicon	#4FC08D	Frontend	\N	0	2026-02-13 13:30:02.264	2026-02-13 13:30:02.264
c005551f-388d-4e8b-be0f-9a6b7545ab45	Angular	angular	devicon-angular-plain	devicon	#DD0031	Frontend	\N	0	2026-02-13 13:30:02.268	2026-02-13 13:30:02.268
34a8ce3e-4403-49cd-a48d-bafe2d6bb7ea	Svelte	svelte	devicon-svelte-plain	devicon	#FF3E00	Frontend	\N	0	2026-02-13 13:30:02.273	2026-02-13 13:30:02.273
ad68f3f2-b8e4-40aa-a8b7-35e7f1f4205c	TypeScript	typescript	devicon-typescript-plain	devicon	#3178C6	Frontend	\N	0	2026-02-13 13:30:02.277	2026-02-13 13:30:02.277
8b748057-2955-4b2e-9de0-a5f210410276	JavaScript	javascript	devicon-javascript-plain	devicon	#F7DF1E	Frontend	\N	0	2026-02-13 13:30:02.281	2026-02-13 13:30:02.281
89664fd1-1856-45fb-a75d-74a582f1cca1	HTML5	html5	devicon-html5-plain	devicon	#E34F26	Frontend	\N	0	2026-02-13 13:30:02.286	2026-02-13 13:30:02.286
ccfb068c-67f1-43a3-925c-6d4112eb000d	CSS3	css3	devicon-css3-plain	devicon	#1572B6	Frontend	\N	0	2026-02-13 13:30:02.291	2026-02-13 13:30:02.291
37f1bed3-54ce-460c-be0c-966deddecf8d	Tailwind CSS	tailwind	devicon-tailwindcss-plain	devicon	#06B6D4	Frontend	\N	0	2026-02-13 13:30:02.295	2026-02-13 13:30:02.295
490e95f0-1ab1-4cc8-928f-ed8bd841358e	Redux	redux	devicon-redux-original	devicon	#764ABC	Frontend	\N	0	2026-02-13 13:30:02.3	2026-02-13 13:30:02.3
5ee77a45-f315-4ffd-a9a6-d0863f75c764	Node.js	nodejs	devicon-nodejs-plain	devicon	#339933	Backend	\N	0	2026-02-13 13:30:02.304	2026-02-13 13:30:02.304
b72f6883-a36e-4d4c-aeb9-c05fe00f816d	Express	express	devicon-express-original	devicon	#000000	Backend	\N	0	2026-02-13 13:30:02.31	2026-02-13 13:30:02.31
dfe9b07f-c4fe-47cd-a559-cfd85af7cfb3	Python	python	devicon-python-plain	devicon	#3776AB	Backend	\N	0	2026-02-13 13:30:02.315	2026-02-13 13:30:02.315
c76a5b97-264a-43ee-a403-272d82b5651d	Django	django	devicon-django-plain	devicon	#092E20	Backend	\N	0	2026-02-13 13:30:02.319	2026-02-13 13:30:02.319
682f6935-8ef6-4b1c-a28c-83637a69d14d	Flask	flask	devicon-flask-original	devicon	#000000	Backend	\N	0	2026-02-13 13:30:02.323	2026-02-13 13:30:02.323
1803fae1-bdca-4895-a4bf-82bab6172048	FastAPI	fastapi	devicon-fastapi-plain	devicon	#009688	Backend	\N	0	2026-02-13 13:30:02.328	2026-02-13 13:30:02.328
fdd2c65e-c94c-41e6-97c7-46b41668b615	PHP	php	devicon-php-plain	devicon	#777BB4	Backend	\N	0	2026-02-13 13:30:02.332	2026-02-13 13:30:02.332
06419164-9e64-43ec-ac70-7eb053241550	Laravel	laravel	devicon-laravel-plain	devicon	#FF2D20	Backend	\N	0	2026-02-13 13:30:02.337	2026-02-13 13:30:02.337
c1d94f7a-0683-452b-8ceb-4b0676671eb4	Ruby	ruby	devicon-ruby-plain	devicon	#CC342D	Backend	\N	0	2026-02-13 13:30:02.343	2026-02-13 13:30:02.343
6720fa41-056b-4d70-8194-80999a5a6339	Ruby on Rails	rails	devicon-rails-plain	devicon	#CC0000	Backend	\N	0	2026-02-13 13:30:02.349	2026-02-13 13:30:02.349
559773b5-346e-406c-a5d1-b83882425dec	Go	go	devicon-go-original-wordmark	devicon	#00ADD8	Backend	\N	0	2026-02-13 13:30:02.354	2026-02-13 13:30:02.354
6f9229e4-ad3b-4f5a-80a7-2ba50ff4617d	Java	java	devicon-java-plain	devicon	#007396	Backend	\N	0	2026-02-13 13:30:02.357	2026-02-13 13:30:02.357
69aa27dc-c112-4f42-9871-9990d094df72	Spring Boot	spring	devicon-spring-plain	devicon	#6DB33F	Backend	\N	0	2026-02-13 13:30:02.362	2026-02-13 13:30:02.362
61375f2b-00b3-4624-9932-2ce0d7e79791	PostgreSQL	postgresql	devicon-postgresql-plain	devicon	#4169E1	Database	\N	0	2026-02-13 13:30:02.366	2026-02-13 13:30:02.366
dd0a34ac-cab5-463b-9f6c-3c03eb7f3dcf	MongoDB	mongodb	devicon-mongodb-plain	devicon	#47A248	Database	\N	0	2026-02-13 13:30:02.37	2026-02-13 13:30:02.37
29784f50-1ce9-4548-9855-36ebaab37046	MySQL	mysql	devicon-mysql-plain	devicon	#4479A1	Database	\N	0	2026-02-13 13:30:02.375	2026-02-13 13:30:02.375
9a574f3f-7218-4c5e-897a-d31490ba7c04	Redis	redis	devicon-redis-plain	devicon	#DC382D	Database	\N	0	2026-02-13 13:30:02.379	2026-02-13 13:30:02.379
86bf57ec-c3bf-4e9a-8006-bb3a31dda7a2	SQLite	sqlite	devicon-sqlite-plain	devicon	#003B57	Database	\N	0	2026-02-13 13:30:02.383	2026-02-13 13:30:02.383
859155f0-b8d1-407c-9b2f-f4dacb019b3c	Firebase	firebase	devicon-firebase-plain	devicon	#FFCA28	Database	\N	0	2026-02-13 13:30:02.387	2026-02-13 13:30:02.387
a64e4ce7-4f74-4c31-a4f2-bd2edddb9f84	Supabase	supabase	devicon-supabase-plain	devicon	#3ECF8E	Database	\N	0	2026-02-13 13:30:02.391	2026-02-13 13:30:02.391
a4e19a21-dc08-4ed9-9aee-a6e6065d39a6	React Native	react-native	devicon-react-original	devicon	#61DAFB	Mobile	\N	0	2026-02-13 13:30:02.396	2026-02-13 13:30:02.396
88b9960b-b387-4baf-acec-f986d3053137	Flutter	flutter	devicon-flutter-plain	devicon	#02569B	Mobile	\N	0	2026-02-13 13:30:02.4	2026-02-13 13:30:02.4
76055633-29f3-4555-a867-00484304c6a6	Swift	swift	devicon-swift-plain	devicon	#FA7343	Mobile	\N	0	2026-02-13 13:30:02.404	2026-02-13 13:30:02.404
ae35ec68-9e1d-4783-8617-f9b72d553d7c	Kotlin	kotlin	devicon-kotlin-plain	devicon	#7F52FF	Mobile	\N	0	2026-02-13 13:30:02.408	2026-02-13 13:30:02.408
2d837183-c40f-4136-a063-22ab45bb21f7	Docker	docker	devicon-docker-plain	devicon	#2496ED	DevOps	\N	0	2026-02-13 13:30:02.413	2026-02-13 13:30:02.413
1c08bffe-1cff-4512-8b88-1dc84ad94d87	Kubernetes	kubernetes	devicon-kubernetes-plain	devicon	#326CE5	DevOps	\N	0	2026-02-13 13:30:02.418	2026-02-13 13:30:02.418
204b0525-c339-4f98-b9af-69793e6d50cc	AWS	aws	devicon-amazonwebservices-original	devicon	#FF9900	Cloud	\N	0	2026-02-13 13:30:02.422	2026-02-13 13:30:02.422
5de2bcc5-1773-4012-b699-c3f19759a12d	Azure	azure	devicon-azure-plain	devicon	#0078D4	Cloud	\N	0	2026-02-13 13:30:02.426	2026-02-13 13:30:02.426
5b9485d4-fda3-4da2-a6e1-b9ee748033c7	Google Cloud	gcp	devicon-googlecloud-plain	devicon	#4285F4	Cloud	\N	0	2026-02-13 13:30:02.431	2026-02-13 13:30:02.431
c2ad9490-5410-4d8e-b0d6-0041044a32be	Vercel	vercel	devicon-vercel-original	devicon	#000000	Cloud	\N	0	2026-02-13 13:30:02.435	2026-02-13 13:30:02.435
b4eedade-49c3-4cd7-91c9-14862c777190	Nginx	nginx	devicon-nginx-original	devicon	#009639	DevOps	\N	0	2026-02-13 13:30:02.439	2026-02-13 13:30:02.439
22d94c03-d4e9-4f0b-a56a-9c33f1b69206	Jenkins	jenkins	devicon-jenkins-plain	devicon	#D24939	DevOps	\N	0	2026-02-13 13:30:02.443	2026-02-13 13:30:02.443
9da0aabd-911f-491a-af9c-893d265d7a01	GitHub Actions	github-actions	devicon-github-original	devicon	#2088FF	DevOps	\N	0	2026-02-13 13:30:02.447	2026-02-13 13:30:02.447
3453b219-a730-475d-a84e-571f99509b73	TensorFlow	tensorflow	devicon-tensorflow-original	devicon	#FF6F00	AI & ML	\N	0	2026-02-13 13:30:02.451	2026-02-13 13:30:02.451
a23c4e2b-3a8c-4024-b2f0-2867705423df	PyTorch	pytorch	devicon-pytorch-original	devicon	#EE4C2C	AI & ML	\N	0	2026-02-13 13:30:02.455	2026-02-13 13:30:02.455
7e633109-8626-448f-a266-f4f0be52c217	OpenAI	openai	devicon-openai-plain	devicon	#412991	AI & ML	\N	0	2026-02-13 13:30:02.46	2026-02-13 13:30:02.46
c0d33ae5-701e-4ff6-ad7c-4dff42aedca0	Figma	figma	devicon-figma-plain	devicon	#F24E1E	Design	\N	0	2026-02-13 13:30:02.466	2026-02-13 13:30:02.466
6b07fb87-0874-4331-9b58-bef354f888a5	Adobe Suite	adobe	devicon-photoshop-plain	devicon	#31A8FF	Design	\N	0	2026-02-13 13:30:02.47	2026-02-13 13:30:02.47
d9aa243a-c7b4-4452-bd02-d4a773837aea	Git	git	devicon-git-plain	devicon	#F05032	Tools	\N	0	2026-02-13 13:30:02.475	2026-02-13 13:30:02.475
f86dd6cb-8157-4ffb-85ff-b93a216066d2	GraphQL	graphql	devicon-graphql-plain	devicon	#E10098	Backend	\N	0	2026-02-13 13:30:02.48	2026-02-13 13:30:02.48
eba89b27-648b-44ab-b1c1-cb7a0d80c168	Prisma	prisma	devicon-prisma-original	devicon	#2D3748	Backend	\N	0	2026-02-13 13:30:02.485	2026-02-13 13:30:02.485
fca7ba1a-0ebf-43dd-b85a-e7d3190c3073	Framer Motion	framer-motion	devicon-framermotion-original	devicon	#0055FF	Frontend	\N	0	2026-02-13 13:30:02.492	2026-02-13 13:30:02.492
af5af820-2e36-4b96-8d4d-01f69998ef78	Sanity CMS	sanity	devicon-sanity-plain	devicon	#F03E2F	Backend	\N	0	2026-02-13 13:30:02.496	2026-02-13 13:30:02.496
54e4a393-0aa4-407f-920b-d6126cad6cfd	HealthKit	healthkit	devicon-apple-original	devicon	#000000	Mobile	\N	0	2026-02-13 13:30:02.501	2026-02-13 13:30:02.501
86dfc4de-3e27-453a-acd9-65f095154e90	Face Recognition	face-recognition	devicon-opencv-plain	devicon	#5C3EE8	AI & ML	\N	0	2026-02-13 13:30:02.506	2026-02-13 13:30:02.506
3f591339-3acb-415b-98ca-6ad6595e45aa	Speech Recognition	speech-recognition	devicon-python-plain	devicon	#3776AB	AI & ML	\N	0	2026-02-13 13:30:02.51	2026-02-13 13:30:02.51
6ac1324d-247c-421d-a3d7-b691ab811cec	Brand Strategy	brand-strategy	devicon-figma-plain	devicon	#F24E1E	Design	\N	0	2026-02-13 13:30:02.515	2026-02-13 13:30:02.515
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testimonials (id, client_name, client_role, company, content, rating, avatar_url, featured, is_active, approved, order_index, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id, assigned_at, assigned_by) FROM stdin;
81babb61-930a-4e03-b3bd-40936363d7ff	4	2026-02-11 13:55:00.559	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, avatar_url, email_verified, is_active, last_login, created_at, updated_at) FROM stdin;
81babb61-930a-4e03-b3bd-40936363d7ff	admin@asagus.com	$2a$12$rJ9/ogIhStqQjLku0jxuGusJzChj9AUymEjPLTRaPRW8cXGR8xzEO	Super Admin	\N	t	t	2026-02-18 17:25:57.331	2026-02-11 13:55:00.549	2026-02-18 17:25:57.334
\.


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 41, true);


--
-- Name: page_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.page_views_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 53, true);


--
-- Name: project_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_metrics_id_seq', 20, true);


--
-- Name: project_testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_testimonials_id_seq', 5, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: client_logos client_logos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_logos
    ADD CONSTRAINT client_logos_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: project_metrics project_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_metrics
    ADD CONSTRAINT project_metrics_pkey PRIMARY KEY (id);


--
-- Name: project_technologies project_technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_technologies
    ADD CONSTRAINT project_technologies_pkey PRIMARY KEY (id);


--
-- Name: project_testimonials project_testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_testimonials
    ADD CONSTRAINT project_testimonials_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: research_projects research_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: technologies technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: analytics_events_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX analytics_events_created_at_idx ON public.analytics_events USING btree (created_at);


--
-- Name: analytics_events_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX analytics_events_name_idx ON public.analytics_events USING btree (name);


--
-- Name: api_keys_key_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX api_keys_key_hash_key ON public.api_keys USING btree (key_hash);


--
-- Name: api_keys_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_keys_user_id_idx ON public.api_keys USING btree (user_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: blog_categories_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_categories_is_active_idx ON public.blog_categories USING btree (is_active);


--
-- Name: blog_categories_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX blog_categories_name_key ON public.blog_categories USING btree (name);


--
-- Name: blog_categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX blog_categories_slug_key ON public.blog_categories USING btree (slug);


--
-- Name: blog_posts_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posts_category_idx ON public.blog_posts USING btree (category);


--
-- Name: blog_posts_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posts_created_at_idx ON public.blog_posts USING btree (created_at);


--
-- Name: blog_posts_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posts_featured_idx ON public.blog_posts USING btree (featured);


--
-- Name: blog_posts_published_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posts_published_at_idx ON public.blog_posts USING btree (published_at);


--
-- Name: blog_posts_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug);


--
-- Name: blog_posts_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posts_status_idx ON public.blog_posts USING btree (status);


--
-- Name: contact_submissions_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_submissions_created_at_idx ON public.contact_submissions USING btree (created_at);


--
-- Name: contact_submissions_is_read_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_submissions_is_read_idx ON public.contact_submissions USING btree (is_read);


--
-- Name: faqs_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX faqs_category_idx ON public.faqs USING btree (category);


--
-- Name: faqs_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX faqs_is_active_idx ON public.faqs USING btree (is_active);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_folder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_folder_idx ON public.media USING btree (folder);


--
-- Name: media_mime_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_mime_type_idx ON public.media USING btree (mime_type);


--
-- Name: newsletter_subscribers_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX newsletter_subscribers_email_key ON public.newsletter_subscribers USING btree (email);


--
-- Name: newsletter_subscribers_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX newsletter_subscribers_is_active_idx ON public.newsletter_subscribers USING btree (is_active);


--
-- Name: page_views_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX page_views_created_at_idx ON public.page_views USING btree (created_at);


--
-- Name: page_views_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX page_views_path_idx ON public.page_views USING btree (path);


--
-- Name: page_views_session_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX page_views_session_id_idx ON public.page_views USING btree (session_id);


--
-- Name: permissions_resource_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_resource_action_key ON public.permissions USING btree (resource, action);


--
-- Name: project_technologies_project_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX project_technologies_project_id_idx ON public.project_technologies USING btree (project_id);


--
-- Name: project_technologies_project_id_technology_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX project_technologies_project_id_technology_id_key ON public.project_technologies USING btree (project_id, technology_id);


--
-- Name: project_technologies_technology_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX project_technologies_technology_id_idx ON public.project_technologies USING btree (technology_id);


--
-- Name: project_testimonials_project_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX project_testimonials_project_id_key ON public.project_testimonials USING btree (project_id);


--
-- Name: projects_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_category_idx ON public.projects USING btree (category);


--
-- Name: projects_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_created_at_idx ON public.projects USING btree (created_at);


--
-- Name: projects_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_featured_idx ON public.projects USING btree (featured);


--
-- Name: projects_published_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_published_idx ON public.projects USING btree (published);


--
-- Name: projects_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX projects_slug_key ON public.projects USING btree (slug);


--
-- Name: refresh_tokens_expires_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_expires_at_idx ON public.refresh_tokens USING btree (expires_at);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);


--
-- Name: research_projects_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX research_projects_category_idx ON public.research_projects USING btree (category);


--
-- Name: research_projects_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX research_projects_featured_idx ON public.research_projects USING btree (featured);


--
-- Name: research_projects_is_public_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX research_projects_is_public_idx ON public.research_projects USING btree (is_public);


--
-- Name: research_projects_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX research_projects_slug_key ON public.research_projects USING btree (slug);


--
-- Name: research_projects_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX research_projects_status_idx ON public.research_projects USING btree (status);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: services_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX services_is_active_idx ON public.services USING btree (is_active);


--
-- Name: services_order_index_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX services_order_index_idx ON public.services USING btree (order_index);


--
-- Name: services_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX services_slug_key ON public.services USING btree (slug);


--
-- Name: settings_group_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX settings_group_idx ON public.settings USING btree ("group");


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: team_members_department_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX team_members_department_idx ON public.team_members USING btree (department);


--
-- Name: team_members_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX team_members_featured_idx ON public.team_members USING btree (featured);


--
-- Name: team_members_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX team_members_is_active_idx ON public.team_members USING btree (is_active);


--
-- Name: team_members_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX team_members_slug_key ON public.team_members USING btree (slug);


--
-- Name: technologies_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX technologies_category_idx ON public.technologies USING btree (category);


--
-- Name: technologies_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX technologies_name_key ON public.technologies USING btree (name);


--
-- Name: technologies_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX technologies_slug_key ON public.technologies USING btree (slug);


--
-- Name: testimonials_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_featured_idx ON public.testimonials USING btree (featured);


--
-- Name: testimonials_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX testimonials_is_active_idx ON public.testimonials USING btree (is_active);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_metrics project_metrics_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_metrics
    ADD CONSTRAINT project_metrics_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_technologies project_technologies_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_technologies
    ADD CONSTRAINT project_technologies_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_technologies project_technologies_technology_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_technologies
    ADD CONSTRAINT project_technologies_technology_id_fkey FOREIGN KEY (technology_id) REFERENCES public.technologies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_testimonials project_testimonials_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_testimonials
    ADD CONSTRAINT project_testimonials_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict XiCBB1pC5EHQx0bDUIWQGiN0LRdbZwYYv7zgsFrPLrhKIN84rg8GARQT3H6Kb9u

