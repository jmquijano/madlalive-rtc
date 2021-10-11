-- Create Table for model "Chat"

-- Table: public.tbl_meeting_chat

-- DROP TABLE IF EXISTS public.tbl_meeting_chat;

CREATE TABLE IF NOT EXISTS public.tbl_meeting_chat
(
    id integer NOT NULL DEFAULT nextval('tbl_meeting_chat_id_seq'::regclass),
    peer integer,
    meeting integer,
    message json,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tbl_meeting_chat_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_meeting_chat
    OWNER to postgres;

GRANT ALL ON TABLE public.tbl_meeting_chat TO postgres WITH GRANT OPTION;