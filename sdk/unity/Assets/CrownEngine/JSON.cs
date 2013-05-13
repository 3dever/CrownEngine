#define READABLE

using UnityEngine;
using System.Collections;
//using System.Collections.Generic;

/*
 * http://www.opensource.org/licenses/lgpl-2.1.php
 * JSON class
 * for use with Unity
 * Copyright Matt Schoen 2010
 */

public class JSON : Nullable {
	const int MAX_DEPTH = 1000;
	public enum Type { NULL, STRING, NUMBER, OBJECT, ARRAY, BOOL }
	public JSON parent;
	public Type type = Type.NULL;
	public ArrayList list = new ArrayList();
	public ArrayList keys = new ArrayList();
	public string str;
	public float n; // double is not supported in Flash :(
	public bool b;

	public static JSON nullJO { get { return new JSON(JSON.Type.NULL); } }
	public static JSON obj { get { return new JSON(JSON.Type.OBJECT); } }
	public static JSON arr { get { return new JSON(JSON.Type.ARRAY); } }

	public JSON(JSON.Type t) {
		type = t;
		switch(t) {
		case Type.ARRAY:
			list = new ArrayList();
			break;
		case Type.OBJECT:
			list = new ArrayList();
			keys = new ArrayList();
			break;
		}
	}
	public JSON(bool b) {
		type = Type.BOOL;
		this.b = b;
	}
	public JSON(float f) {
		type = Type.NUMBER;
		this.n = f;
	}
	/*public JSON(Dictionary<string, string> dic) {
		type = Type.OBJECT;
		foreach(KeyValuePair<string, string> kvp in dic){
			keys.Add(kvp.Key);
			list.Add(kvp.Value);
		}
	}*/
	public JSON() 
	{ 
		type = Type.OBJECT;
		list = new ArrayList();
		keys = new ArrayList();
	}

	public JSON(string str) {	//create a new JSON from a string (this will also create any children, and parse the whole string)
		//Debug.Log(str);
		if(str != null) {
			#if(READABLE)
			str = str.Replace("\\n", "");
			str = str.Replace("\\t", "");
			str = str.Replace("\\r", "");
			str = str.Replace("\t", "");
			str = str.Replace("\n", "");
			str = str.Replace("\\", "");
			#endif
			if(str.Length > 0) {
				if(str == "true" || str == "True" || str == "TRUE") {
					type = Type.BOOL;
					b = true;
				} else if(str == "false" || str == "False" || str == "FALSE") {
					type = Type.BOOL;
					b = false;
				} else if(str == "null") {
					type = Type.NULL;
				} else if(str[0] == '"') {
					type = Type.STRING;
					this.str = str.Substring(1, str.Length - 2);
				} else if(str[0] == '{' || str[0] == '[') {
					int token_tmp = 0;
					/*
					 * Checking for the following formatting (www.json.org)
					 * object - {"field1":value,"field2":value}
					 * array - [value,value,value]
					 * value - string	- "string"
					 *		 - number	- 0.0
					 *		 - bool		- true -or- false
					 *		 - null		- null
					 */
					switch(str[0]) {
					case '{':
						type = Type.OBJECT;
						keys = new ArrayList();
						list = new ArrayList();
						break;
					case '[':
						type = JSON.Type.ARRAY;
						list = new ArrayList();
						break;						
					default:
						type = Type.NULL;
						Debug.LogWarning("improper JSON formatting:" + str);
						return;
					}
					// Parse
					int depth = 0;
					bool openquote = false;
					bool inProp = false;

					for(int i = 1; i < str.Length; i++) {
						if(str[i] == '\\') {
							i++;
							continue;
						}
						if(str[i] == '"')
							openquote = !openquote;
						if(str[i] == '[' || str[i] == '{')
							depth++;
						if(depth == 0 && !openquote) {
							if(str[i] == ':' && !inProp) {
								inProp = true;
								try {
									keys.Add(str.Substring(token_tmp + 2, i - token_tmp - 3));
								} catch { Debug.Log(i + " - " + str.Length + " - " + str); }
								token_tmp = i;
							}
							if(str[i] == ',') {
								inProp = false;
								list.Add(new JSON(str.Substring(token_tmp + 1, i - token_tmp - 1)));
								token_tmp = i;
							}
							if(str[i] == ']' || str[i] == '}')
								list.Add(new JSON(str.Substring(token_tmp + 1, i - token_tmp - 1)));
						}
						if(str[i] == ']' || str[i] == '}')
							depth--;
					}
				} else {
					n = float.Parse (str); //System.Convert.ToDouble(str);
					type = Type.NUMBER;
				}
			}
		} else {
			type = Type.NULL;	//If the string is missing, this is a null
		}
	}

	public void AddField(bool val) { Add(new JSON(val)); }
	public void AddField(float val) { Add(new JSON(val)); }
	public void AddField(int val) { Add(new JSON(val)); }
	public void Add(JSON obj) {
		if(obj) {		//Don't do anything if the object is null
			if(type != JSON.Type.ARRAY) {
				type = JSON.Type.ARRAY;		//Congratulations, son, you're an ARRAY now
				Debug.LogWarning("tried to add an object to a non-array JSON.  We'll do it for you, but you might be doing something wrong.");
			}
			list.Add(obj);
		}
	}
	public void AddField(string name, bool val) { AddField(name, new JSON(val)); }
	public void AddField(string name, float val) { AddField(name, new JSON(val)); }
	public void AddField(string name, int val) { AddField(name, new JSON(val)); }
	public void AddField(string name, string val) {
		AddField(name, new JSON { type = JSON.Type.STRING, str = val });
	}

	public void AddField(string name, JSON obj) {
		if(obj){		//Don't do anything if the object is null
			if(type != JSON.Type.OBJECT){
				type = JSON.Type.OBJECT;		//Congratulations, son, you're an OBJECT now
				Debug.LogWarning("tried to add a field to a non-object JSON.  We'll do it for you, but you might be doing something wrong.");
			}
			keys.Add(name);
			list.Add(obj);
		}
	}

	public void SetField(string name, JSON obj) {
		if(HasField(name)) {
			list.Remove(this[name]);
			keys.Remove(name);
		}
		AddField(name, obj);
	}

	public JSON GetField(string name) {
		if(type == JSON.Type.OBJECT)
			for(int i = 0; i < keys.Count; i++)
				if((string)keys[i] == name)
					return (JSON)list[i];
		return null;
	}

	public bool HasField(string name) {
		if(type == JSON.Type.OBJECT)
			for(int i = 0; i < keys.Count; i++)
				if((string)keys[i] == name)
					return true;
		return false;
	}

	public void Clear() {
		type = JSON.Type.NULL;
		list.Clear();
		keys.Clear();
		str = "";
		n = 0;
		b = false;
	}
	public JSON Copy() {
		return new JSON(print());
	}

	/*
	 * The Merge function is experimental. Use at your own risk.
	 */
	public void Merge(JSON obj) {
		MergeRecur(this, obj);
	}

	static void MergeRecur(JSON left, JSON right) {
		if(right.type == JSON.Type.OBJECT) {
			for(int i = 0; i < right.list.Count; i++) {
				if(right.keys[i] != null) {
					string key = (string)right.keys[i];
					JSON val = (JSON)right.list[i];
					if(val.type == JSON.Type.ARRAY || val.type == JSON.Type.OBJECT) {
						if(left.HasField(key))
							MergeRecur(left[key], val);
						else
							left.AddField(key, val);
					} else {
						if(left.HasField(key))
							left.SetField(key, val);
						else
							left.AddField(key, val);
					}
				}
			}
		}// else left.list.Add(right.list);
	}

	public string print() {
		return print(0);
	}

	public string print(int depth) {	//Convert the JSON into a stiring
		if(depth++ > MAX_DEPTH) {
			Debug.Log("reached max depth!");
			return "";
		}
		string str = "";
		switch(type) {
		case Type.STRING:
			str = "\"" + this.str + "\"";
			break;
		case Type.NUMBER:
			str += n;
			break;
		case JSON.Type.OBJECT:
			if(list.Count > 0) {
				str = "{";
#if(READABLE)	//for a bit more readability, comment the define above to save space
				str += "\n";
				depth++;
#endif
				for(int i = 0; i < list.Count; i++) {
					string key = (string)keys[i];
					JSON obj = (JSON)list[i];
					if(obj) {
#if(READABLE)
						for(int j = 0; j < depth; j++)
							str += "\t"; //for a bit more readability
#endif
						str += "\"" + key + "\":";
						str += obj.print(depth) + ",";
#if(READABLE)
						str += "\n";
#endif
					}
				}
#if(READABLE)
				str = str.Substring(0, str.Length - 1);
#endif
				str = str.Substring(0, str.Length - 1);
				str += "}";
			} else str += "null";
			break;
		case JSON.Type.ARRAY:
			if(list.Count > 0) {
				str = "[";
#if(READABLE)
				str += "\n"; //for a bit more readability
				depth++;
#endif
				foreach(JSON obj in list) {
					if(obj) {
#if(READABLE)
						for(int j = 0; j < depth; j++)
							str += "\t"; //for a bit more readability
#endif
						str += obj.print(depth) + ",";
#if(READABLE)
						str += "\n"; //for a bit more readability
#endif
					}
				}
#if(READABLE)
				str = str.Substring(0, str.Length - 1);
#endif
				str = str.Substring(0, str.Length - 1);
				str += "]";
			}
			break;
		case Type.BOOL:
			if(b)
				str += "true";
			else
				str += "false";
			break;
		case Type.NULL:
			str = "null";
			break;
		}
		return str;
	}
	public JSON this[int index] {
		get { return (JSON)list[index]; }
	}
	public JSON this[string index] {
		get { return GetField(index); }
	}
	public override string ToString() {
		return print();
	}
	/*public Dictionary<string, string> ToDictionary() {
		if(type == Type.OBJECT) {
			Dictionary<string, string> result = new Dictionary<string, string>();
			for(int i = 0; i < list.Count; i++) {
				JSON val = (JSON)list[i];
				switch(val.type){
				case Type.STRING:	result.Add((string)keys[i], val.str);		break;
				case Type.NUMBER:	result.Add((string)keys[i], val.n + "");	break;
				case Type.BOOL:		result.Add((string)keys[i], val.b + "");	break;
				default: Debug.LogWarning("Omitting object: " + (string)keys[i] + " in dictionary conversion"); break;
				}
			}
			return result;
		} else Debug.LogWarning("Tried to turn non-Object JSON into a dictionary");
		return null;
	}*/
}

public class Nullable {
    //Extend this class if you want to use the syntax
    //  if(myObject)
    //to check if it is not null
    public static implicit operator bool(Nullable o) {
        return (object)o != null;
    }
}