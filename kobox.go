package main

import (
	json "encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"bytes"
	"github.com/gorilla/mux"
	"strings"
	// "strconv"
)

// useful for filtering the data content
type JsonData struct {
	Text  string `json:"text"`
	ID    string `json:"_id"`
	Field string `json:"field"`
}

type CopyPasteData struct {
	Text string `json:"text"`
}

type FileDataArray []FileData

type FileData struct {
    FileName string `json:"fileName"`
}

func setupResponse(w http.ResponseWriter) {
	(w).Header().Set("Access-Control-Allow-Origin", "*")
	(w).Header().Set("Content-Type", "application/json; charset=UTF-8")
	(w).Header().Set("Access-Control-Allow-Headers", "*")
	(w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH")
}

func JsonArrayHandler(w http.ResponseWriter, r *http.Request) {
	setupResponse(w)

	jsonFile, err := os.Open("testArray.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened testArray.json")
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var result map[string]interface{}
	err2 := json.Unmarshal([]byte(byteValue), &result)

	if err2 != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(result)
	fmt.Println(result)
}

func CopyPasteHandler(w http.ResponseWriter, r *http.Request) {
	setupResponse(w)

	jsonFile, err := os.Open("test.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened test.json")
	byteValue, _ := ioutil.ReadAll(jsonFile)

	switch r.Method {
	case http.MethodGet:
		fmt.Println("GET request")

		var result map[string]interface{}
		err := json.Unmarshal([]byte(byteValue), &result)

		if err != nil {
			fmt.Println(err)
		}

		json.NewEncoder(w).Encode(result)
		fmt.Println(result)

	case http.MethodPost:
		fmt.Println("POST request")

		decoder := json.NewDecoder(r.Body)
		var body CopyPasteData

		err2 := decoder.Decode(&body)
		if err2 != nil {
			panic(err)
		}

		var result CopyPasteData
		err := json.Unmarshal([]byte(byteValue), &result)

		if err != nil {
			fmt.Println(err)
		}

		fmt.Printf("body %s", body.Text)
		result.Text = body.Text

		fmt.Println(result)

		b, err := json.Marshal(result)
		if err != nil {
			panic(err)
		}
		_ = ioutil.WriteFile("test.json", b, 0644)
		w.WriteHeader(200)
		fmt.Println("success")
	}
	jsonFile.Close()
}

func FilesHandler(w http.ResponseWriter, r *http.Request) {
	setupResponse(w)

	switch r.Method {
	case http.MethodGet:
		files, err := ioutil.ReadDir("./files")

		if (err != nil) {
			fmt.Println(err)
			os.Exit(1)
		}

		var fileNames = FileDataArray{}

		for _, f := range files {
			fmt.Println(f.Name())
			jsonData := FileData{ FileName: f.Name()}
			b, err := json.Marshal(jsonData)
			if err != nil {
				fmt.Println("error:", err)
				w.WriteHeader(400)
			}

			var fileData FileData
			err = json.Unmarshal([]byte(b), &fileData)

			if err != nil {
				fmt.Println(err)
				w.WriteHeader(400)
			}

			if (!strings.HasPrefix(f.Name(), ".")) {
				fileNames = append(fileNames, fileData)
			}
		}

		json.NewEncoder(w).Encode(fileNames)
	}
}

func FileHandler(w http.ResponseWriter, r *http.Request) {
	setupResponse(w)

	vars := mux.Vars(r)
	fileName := vars["fileName"]

	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Disposition", "attachment; filename=" + fileName)
		streamBytes, err := ioutil.ReadFile("files/" + fileName)

		if (err != nil) {
			fmt.Printf("Err %s\n", err)
			w.WriteHeader(404)
		} 
		
		io.Copy(w, bytes.NewReader(streamBytes))
		w.WriteHeader(200)

	// upload
	case http.MethodPut:
		r.ParseMultipartForm(32 << 20)
		file, handler, err := r.FormFile("uploadFile")
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(400)
		}
		defer file.Close()
		f, err := os.OpenFile("./files/" + handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(400)
		}
		defer f.Close()
		io.Copy(f, file)
		w.WriteHeader(200)

	// delete
	case http.MethodDelete:
		err := os.Remove("./files/" + fileName)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(400)
		}
		w.WriteHeader(200)
	}

}

func main() {
	fmt.Println("Starting http file server on 5000")
	r := mux.NewRouter()
	r.HandleFunc("/", JsonArrayHandler)
	r.HandleFunc("/copyPaste", CopyPasteHandler)

	/* API: 
		GET: returns a list of all files
		POST: upload a new file
		GET: downlaod the file with name
		DEL: delete the file with name
	*/
		
	r.HandleFunc("/files", FilesHandler);
	r.HandleFunc("/files/{fileName}", FileHandler);

	http.Handle("/", r)

	err := http.ListenAndServe(":5000", nil)
	if err != nil {
		fmt.Println(err)
	}
}
