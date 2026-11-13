import { useEffect, useRef, useState } from "react";
import { createExam, deleteExam, describeError, listExams } from "./api";

export default function useExams() {
  const [status, setStatus] = useState("loading");
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const savingRef = useRef(false);
  const removingRef = useRef(new Set());

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setStatus("loading");
    setExams([]);
    setError(null);
    listExams({ signal: controller.signal }).then((data) => {
      if (!cancelled) {
        setExams(data);
        setStatus("ready");
      }
    }).catch((requestError) => {
      if (!cancelled) {
        setExams([]);
        setError(describeError(requestError));
        setStatus("error");
      }
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [revision]);

  function reload() {
    setRevision((value) => value + 1);
  }

  async function remove(id) {
    if (removingRef.current.has(id)) return false;
    removingRef.current.add(id);
    setActionError(null);
    try {
      await deleteExam(id);
      setExams((current) => current.filter((exam) => exam.id !== id));
      return true;
    } catch (requestError) {
      setActionError(describeError(requestError));
      return false;
    } finally {
      removingRef.current.delete(id);
    }
  }

  async function create(title) {
    if (savingRef.current) return false;
    savingRef.current = true;
    setSaving(true);
    setActionError(null);
    try {
      const created = await createExam(title);
      setExams((current) => [...current, created]);
      return true;
    } catch (requestError) {
      setActionError(describeError(requestError));
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return {
    status, exams, error, actionError, saving, reload, remove, create,
  };
}
